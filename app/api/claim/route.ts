import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, getAddress, http, isAddress, parseEther, formatEther, type Address } from "viem";
import { mainnet } from "viem/chains";
import { Redis } from "@upstash/redis";
import { allChains, getChainKey, DISTRIBUTION_AMOUNT } from "../../config";
import { signerManager, getNextSignerIndex, getAndIncrementNonce } from "../../utils/signers";
import arcjet, { detectBot, tokenBucket } from "@arcjet/next";
import { isSpoofedBot } from "@arcjet/inspect";

// Initialize Redis with proper error handling
let redis: ReturnType<typeof Redis.fromEnv>;
try {
	redis = Redis.fromEnv();
} catch (error) {
	console.error("Failed to initialize Redis:", error);
	throw new Error("Redis configuration is missing. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.");
}

const ethPublicClient = createPublicClient({
	transport: http(),
	chain: mainnet
});

const GAS_PRICE = 100_000n; // Hardcoded gas price for all chains

// Arcjet protection configuration
const aj = arcjet({
	key: process.env.ARCJET_KEY!,
	rules: [
		// Bot protection - block automated clients
		detectBot({
			mode: "LIVE", // Block requests, use "DRY_RUN" to log only
			// Allow search engines only
			allow: ["CATEGORY:SEARCH_ENGINE"],
		}),
		// Rate limiting - strict: 2 requests per minute
		tokenBucket({
			mode: "LIVE", // Block requests, use "DRY_RUN" to log only
			characteristics: ["ip", "userId"], // Track by IP and wallet address
			refillRate: 2, // Refill 2 tokens per interval
			interval: 60, // Refill every 60 seconds (1 minute)
			capacity: 2, // Maximum capacity of 2 tokens
		}),
	],
});

// Helper function to extract IP address from request
// Returns null if IP cannot be determined (Arcjet will handle this)
function getIpAddress(request: NextRequest): string | null {
	// Try various headers that might contain the IP
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) {
		// x-forwarded-for can contain multiple IPs, take the first one
		const ip = forwarded.split(",")[0].trim();
		if (ip && ip !== "unknown") {
			return ip;
		}
	}
	
	const realIp = request.headers.get("x-real-ip");
	if (realIp && realIp !== "unknown") {
		return realIp;
	}
	
	const cfConnectingIp = request.headers.get("cf-connecting-ip");
	if (cfConnectingIp && cfConnectingIp !== "unknown") {
		return cfConnectingIp;
	}
	
	// Return null if no IP can be determined - Arcjet will skip IP-based rate limiting
	return null;
}

// Helper function to get total amount received by a user on a specific chain
async function getTotalReceived(address: string, chainKey: string): Promise<bigint> {
	const key = `claim:total:${chainKey}:${address.toLowerCase()}`;
	const total = await redis.get<string>(key);
	if (!total) {
		return BigInt(0);
	}
	try {
		return BigInt(total);
	} catch {
		return BigInt(0);
	}
}

// Helper function to update total amount received by a user on a specific chain
async function updateTotalReceived(address: string, chainKey: string, amount: bigint): Promise<void> {
	const key = `claim:total:${chainKey}:${address.toLowerCase()}`;
	const currentTotal = await getTotalReceived(address, chainKey);
	const newTotal = currentTotal + amount;
	await redis.set(key, newTotal.toString());
}

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

		// Resolve address (handle ENS) - needed early for rate limiting
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

		// Extract IP address for rate limiting
		// Use a fallback if IP cannot be determined (Arcjet requires a value)
		const ip = getIpAddress(request) || "0.0.0.0";

		// Apply Arcjet protection
		const decision = await aj.protect(request, {
			ip,
			userId: resolvedAddress, // Use wallet address as userId for rate limiting
			requested: 1, // Each request consumes 1 token
		});

		// Check if request is denied
		if (decision.isDenied()) {
			// Bot detection
			if (decision.reason.isBot()) {
				return NextResponse.json(
					{ error: "Access denied. Automated clients are not allowed." },
					{ status: 403 }
				);
			}
			// Rate limiting
			return NextResponse.json(
				{ error: "Too many requests. Please wait before trying again." },
				{ status: 429 }
			);
		}

		// Additional bot verification check (for paid accounts)
		if (decision.results.some(isSpoofedBot)) {
			return NextResponse.json(
				{ error: "Access denied. Suspicious activity detected." },
				{ status: 403 }
			);
		}

		// Process all chains in parallel
		const claimResults = await Promise.all(
			allChains.map(async (chain) => {
				try {
					const chainKey = getChainKey(chain);
					// Check if user has already received >= 2x the distribution amount on this chain
					const distributionAmount = parseEther(DISTRIBUTION_AMOUNT.toString());
					const maxAllowedAmount = distributionAmount * BigInt(2); // 2x the fill up amount
					const totalReceived = await getTotalReceived(resolvedAddress, chainKey);

					// If user has already received >= 2x, skip this chain
					if (totalReceived >= maxAllowedAmount) {
						return {
							chainKey,
							chainName: chain.name,
							success: false,
							error: `Maximum claim limit reached (${formatEther(maxAllowedAmount)} sFUEL)`,
							skipped: true
						};
					}

					// Calculate how much we can send (remaining amount up to distributionAmount)
					const remainingAllowed = maxAllowedAmount - totalReceived;
					const amountToSend = remainingAllowed < distributionAmount ? remainingAllowed : distributionAmount;

					// If remaining allowed is 0 or negative, skip
					if (amountToSend <= BigInt(0)) {
						return {
							chainKey,
							chainName: chain.name,
							success: false,
							error: `Maximum claim limit reached (${formatEther(maxAllowedAmount)} sFUEL)`,
							skipped: true
						};
					}

					// Get next signer index for this chain (per-chain rotation)
					const signerIndex = await getNextSignerIndex(redis, chainKey);
					const wallet = signerManager.getSigner(signerIndex, chain);

					// Get and increment nonce for this signer on this chain
					const nonce = await getAndIncrementNonce(redis, signerIndex, chainKey);

					// Create public client for this chain
					// Explicitly use the chain's RPC URL to avoid URL parsing issues
					const rpcUrl = chain.rpcUrls.default.http[0];
					const publicClient = createPublicClient({
						transport: http(rpcUrl),
						chain
					});

					// Send direct transfer with calculated amount
					const hash = await wallet.sendTransaction({
						chain,
						to: resolvedAddress,
						value: amountToSend,
						gas: BigInt(21_000), // Standard transfer gas limit
						gasPrice: GAS_PRICE,
						nonce
					});

					// Wait for transaction receipt
					await publicClient.waitForTransactionReceipt({ hash });

					// Update total received amount for this user on this chain
					await updateTotalReceived(resolvedAddress, chainKey, amountToSend);

					return {
						chainKey,
						chainName: chain.name,
						success: true,
						hash,
						amountSent: formatEther(amountToSend)
					};
				} catch (error: any) {
					const chainKey = getChainKey(chain);
					console.error(`Error claiming for ${chainKey}:`, error);
					return {
						chainKey,
						chainName: chain.name,
						success: false,
						error: error.message || String(error)
					};
				}
			})
		);

		const successful = claimResults.filter((r) => r.success).length;
		const skipped = claimResults.filter((r) => !r.success && (r as any).skipped).length;
		const failed = claimResults.filter((r) => !r.success && !(r as any).skipped).length;

		// If all claims failed (not skipped), return error
		if (failed === allChains.length) {
			// Check if it's a user input error (unlikely at this point, but check anyway)
			const firstError = claimResults.find((r) => !r.success && !(r as any).skipped)?.error || "";
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
				skipped,
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

