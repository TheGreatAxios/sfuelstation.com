import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { allChains } from "../../../config";
import { Redis } from "@upstash/redis";
import { signerManager } from "../../../utils/signers";

// Environment variables
const THRESHOLD = process.env.SIGNER_THRESHOLD || ""; // If set, use this as absolute threshold, otherwise use chain threshold
const TARGET_BALANCE_MULTIPLIER = parseFloat(process.env.TARGET_BALANCE_MULTIPLIER || "2.5"); // Default 2.5x for top-up target
const FUNDING_WALLET_PRIVATE_KEY = process.env.FUNDING_WALLET_PRIVATE_KEY;
const MAX_SIGNERS = parseInt(process.env.MAX_SIGNERS || "10");

const redis = Redis.fromEnv();

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get('authorization');
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response('Unauthorized', {
			status: 401,
		});
	}
	
	try {
		if (!FUNDING_WALLET_PRIVATE_KEY) {
			return NextResponse.json({ error: "FUNDING_WALLET_PRIVATE_KEY not configured" }, { status: 500 });
		}

		console.log(`Starting balance check for ${MAX_SIGNERS} signers across ${allChains.length} chains`);

		// Process all chains in parallel
		const chainResults = await Promise.allSettled(
			allChains.map(async (chainConfig) => {
				const chain = chainConfig.chain;
				// Use absolute threshold if set, otherwise use chain threshold
				const threshold = THRESHOLD 
					? parseEther(THRESHOLD)
					: parseEther(chainConfig.threshold.toString());
				
				const publicClient = createPublicClient({
					transport: http(),
					chain
				});

				// Get all signer addresses and their current balances for this chain
				const signers = signerManager.getAllSigners(chain);
				const signerAddresses = signers.map(signer => signer.account.address);

				// Get all balances using individual calls (multicall doesn't work for native balance)
				const balances = await Promise.all(
					signerAddresses.map(address => publicClient.getBalance({ address: address as `0x${string}`}))
				);

				const lowBalanceSigners = [];
				const results = [];

				for (let i = 0; i < signerAddresses.length; i++) {
					const balance = balances[i];
					const address = signerAddresses[i];

					console.log(`[${chainConfig.chainKey}] Signer ${i}: ${address} - Balance: ${balance}`);

					if (balance < threshold) {
						lowBalanceSigners.push({
							index: i,
							address,
							balance: balance.toString(),
							needsTopUp: true
						});

						// Top up this signer
						await topUpSigner(i, address, balance, chain, chainConfig.chainKey, threshold);
					} else {
						results.push(`Signer ${i} (${address}) - Balance OK: ${balance}`);
					}
				}

				return {
					chainKey: chainConfig.chainKey,
					chainName: chainConfig.name,
					threshold: threshold.toString(),
					lowBalanceSigners,
					results,
					checked: signerAddresses.length
				};
			})
		);

		const processedResults = chainResults.map((result, index) => {
			if (result.status === "fulfilled") {
				return result.value;
			} else {
				return {
					chainKey: allChains[index]?.chainKey || "unknown",
					chainName: allChains[index]?.name || "Unknown",
					error: result.reason?.message || "Unknown error"
				};
			}
		});

		const totalLowBalance = processedResults.reduce((sum, r) => sum + (r.lowBalanceSigners?.length || 0), 0);
		const totalChecked = processedResults.reduce((sum, r) => sum + (r.checked || 0), 0);

		return NextResponse.json({
			success: true,
			message: `Checked ${totalChecked} signers across ${allChains.length} chains. ${totalLowBalance} needed top-up.`,
			results: processedResults,
			summary: {
				totalChains: allChains.length,
				totalSigners: totalChecked,
				totalLowBalance
			},
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error("Error in monitor-and-fill:", error);
		return NextResponse.json({
			error: "Internal server error",
			message: error instanceof Error ? error.message : "Unknown error"
		}, { status: 500 });
	}
}

async function topUpSigner(
	signerIndex: number,
	address: string,
	currentBalance: bigint,
	chain: typeof allChains[0]['chain'],
	chainKey: string,
	threshold: bigint
) {
	if (!FUNDING_WALLET_PRIVATE_KEY) {
		throw new Error("FUNDING_WALLET_PRIVATE_KEY not configured");
	}

	// Create funding wallet client
	const { privateKeyToAccount } = await import("viem/accounts");
	const fundingAccount = privateKeyToAccount(FUNDING_WALLET_PRIVATE_KEY as `0x${string}`);
	const fundingWallet = createWalletClient({
		account: fundingAccount,
		transport: http(),
		chain
	});

	// Calculate amount to send (target balance minus current balance)
	// Top up to TARGET_BALANCE_MULTIPLIER times the threshold to provide buffer
	const thresholdValue = threshold;
	const targetBalance = parseEther((Number(thresholdValue) / 1e18 * TARGET_BALANCE_MULTIPLIER).toString());
	const amountToSend = targetBalance - currentBalance;

	if (amountToSend <= BigInt(0)) {
		return; // Already at or above target
	}

	// Get nonce for funding wallet on this chain
	const nonceKey = `nonce:${chainKey}:funding_wallet`;
	const currentNonce = await redis.get(nonceKey);
	const nonce = currentNonce ? Number(currentNonce) : 0;

	// Send transaction
	await fundingWallet.sendTransaction({
		to: address as `0x${string}`,
		value: amountToSend,
		nonce: nonce,
		gas: BigInt(21_000),
		gasPrice: BigInt(100_000),
		chain
	});

	// Update nonce
	await redis.set(nonceKey, nonce + 1);

	console.log(`[${chainKey}] Topped up signer ${signerIndex} with ${amountToSend} wei`);
}

// Health check endpoint for cron monitoring
export async function POST(request: NextRequest) {
	return NextResponse.json({
		status: "healthy",
		timestamp: new Date().toISOString(),
		service: "sfuelstation-monitor"
	});
}

