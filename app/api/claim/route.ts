import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, getAddress, http, isAddress, type Address } from "viem";
import { mainnet } from "viem/chains";
import { Redis } from "@upstash/redis";
import { allChains, type ChainConfig } from "../../config";
import { signerManager, getNextSignerIndex, getAndIncrementNonce } from "../../utils/signers";

const redis = Redis.fromEnv();
const ethPublicClient = createPublicClient({
	transport: http(),
	chain: mainnet
});

const GAS_LIMIT = 100_000n;
const GAS_PRICE = 10_000_000_000n; // 10 gwei

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { address } = body;

		if (!address) {
			return NextResponse.json(
				{ error: "Error claiming sFUEL, try again later or contact support@dirtroad.dev." },
				{ status: 400 }
			);
		}

		// Resolve address (handle ENS)
		let resolvedAddress: `0x${string}`;
		if (!isAddress(address)) {
			const _resolvedAddress = await ethPublicClient.getEnsAddress({ name: address });
			if (!_resolvedAddress) {
				return NextResponse.json(
					{ error: "Error claiming sFUEL, try again later or contact support@dirtroad.dev." },
					{ status: 400 }
				);
			}
			resolvedAddress = getAddress(_resolvedAddress);
		} else {
			resolvedAddress = getAddress(address);
		}

		// Process all chains in parallel
		const claimPromises = allChains.map(async (chainConfig) => {
			try {
				// Get next signer index and wallet for this transaction
				const signerIndex = await getNextSignerIndex(redis);
				const wallet = signerManager.getSigner(signerIndex, chainConfig.chain);

				// Get and increment nonce for this signer on this chain
				const nonce = await getAndIncrementNonce(redis, signerIndex, chainConfig.chain.id);

				// Create public client for this chain
				const publicClient = createPublicClient({
					transport: http(),
					chain: chainConfig.chain
				});

				// Prepare transaction data
				// Encode recipient address as last 20 bytes (remove 0x prefix)
				const recipientAddress = resolvedAddress.substring(2).toLowerCase();
				const data = `${chainConfig.functionSignature}000000000000000000000000${recipientAddress}` as `0x${string}`;

				// Send transaction
				const hash = await wallet.sendTransaction({
					to: chainConfig.proofOfWork as Address,
					data,
					gas: GAS_LIMIT,
					gasPrice: GAS_PRICE,
					nonce
				});

				// Wait for transaction receipt
				await publicClient.waitForTransactionReceipt({ hash });

				return {
					chainKey: chainConfig.chainKey,
					chainName: chainConfig.name,
					success: true,
					hash
				};
			} catch (error: any) {
				console.error(`Error claiming for ${chainConfig.chainKey}:`, error);
				return {
					chainKey: chainConfig.chainKey,
					chainName: chainConfig.name,
					success: false,
					error: error.message || String(error)
				};
			}
		});

		const results = await Promise.allSettled(claimPromises);
		const claimResults = results.map((result) =>
			result.status === "fulfilled" ? result.value : { success: false, error: "Promise rejected" }
		);

		const successful = claimResults.filter((r) => r.success).length;
		const failed = claimResults.filter((r) => !r.success).length;

		// If all claims failed, return error
		if (failed === allChains.length) {
			// Check if it's a user input error (unlikely at this point, but check anyway)
			const firstError = claimResults.find((r) => !r.success)?.error || "";
			const isUserInputError = firstError.toLowerCase().includes("invalid") || 
			                          firstError.toLowerCase().includes("missing") ||
			                          firstError.toLowerCase().includes("required");
			
			return NextResponse.json(
				{ error: "Error claiming sFUEL, try again later or contact support@dirtroad.dev." },
				{ status: isUserInputError ? 400 : 500 }
			);
		}

		// Return results with 200 status (partial success is still success)
		return NextResponse.json({
			success: failed === 0,
			results: claimResults,
			summary: {
				total: allChains.length,
				successful,
				failed
			}
		});
	} catch (error: any) {
		console.error("Error in claim API:", error);
		
		// Determine if it's a user input error or server error
		const errorMessage = error.message || String(error);
		const isUserInputError = errorMessage.toLowerCase().includes("invalid") ||
		                        errorMessage.toLowerCase().includes("missing") ||
		                        errorMessage.toLowerCase().includes("required") ||
		                        errorMessage.toLowerCase().includes("bad request");
		
		return NextResponse.json(
			{ error: "Error claiming sFUEL, try again later or contact support@dirtroad.dev." },
			{ status: isUserInputError ? 400 : 500 }
		);
	}
}

