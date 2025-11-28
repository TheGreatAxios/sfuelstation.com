import { mnemonicToAccount } from "viem/accounts";
import { createWalletClient, http, type Chain } from "viem";

/**
 * Signer utility for managing multiple signers from a single mnemonic
 * Supports multichain by creating wallet clients for different chains
 */
export class MultiSignerManager {
	private mnemonic: string;
	private maxSigners: number;

	constructor(mnemonic: string, maxSigners: number) {
		this.mnemonic = mnemonic;
		this.maxSigners = maxSigners;
	}

	/**
	 * Get a wallet client for a specific signer index and chain
	 */
	getSigner(signerIndex: number, chain: Chain) {
		if (signerIndex < 0 || signerIndex >= this.maxSigners) {
			throw new Error(`Signer index out of range: ${signerIndex}`);
		}

		const account = mnemonicToAccount(this.mnemonic, { addressIndex: signerIndex });
		// Explicitly use the chain's RPC URL to avoid URL parsing issues
		const rpcUrl = chain.rpcUrls.default.http[0];
		return createWalletClient({
			account,
			transport: http(rpcUrl),
			chain
		});
	}

	/**
	 * Get all signers for a specific chain
	 */
	getAllSigners(chain: Chain) {
		const signers = [];
		for (let i = 0; i < this.maxSigners; i++) {
			signers.push(this.getSigner(i, chain));
		}
		return signers;
	}

	/**
	 * Get the maximum number of signers
	 */
	getMaxSigners(): number {
		return this.maxSigners;
	}
}

/**
 * Get the current signer index from Redis and increment for next use
 * Uses a per-chain key that rotates across all signers for each chain independently
 */
export async function getNextSignerIndex(
	redis: any,
	chainKey?: string
): Promise<number> {
	// Use chain-specific key if provided, otherwise use global key
	const key = chainKey ? `current_signer_index:${chainKey}` : "current_signer_index";
	const currentIndex = await redis.get(key);
	if (currentIndex === null || currentIndex === undefined) {
		// Initialize to 0 if not set
		await redis.set(key, 0);
		return 0;
	}

	const nextIndex = (parseInt(currentIndex) + 1) % signerManager.getMaxSigners();
	await redis.set(key, nextIndex);
	return nextIndex;
}

/**
 * Get and increment nonce for a specific signer on a specific chain
 * Uses chainKey for better readability (matches skale-base-sepolia pattern)
 */
export async function getAndIncrementNonce(
	redis: any,
	signerIndex: number,
	chainKey: string
): Promise<number> {
	const nonceKey = `nonce:${chainKey}:signer:${signerIndex}`;
	const currentNonce = await redis.get(nonceKey);
	const nonce = currentNonce ? Number(currentNonce) : 0;

	// Increment nonce for next transaction
	await redis.set(nonceKey, nonce + 1);
	return nonce;
}

/**
 * Initialize the signer manager from environment
 */
export function initializeSignerManager(): MultiSignerManager {
	const mnemonic = process.env.MNEMONIC;
	if (!mnemonic) {
		throw new Error("MNEMONIC environment variable is required");
	}

	const maxSigners = parseInt(process.env.MAX_SIGNERS || "10");
	return new MultiSignerManager(mnemonic, maxSigners);
}

// Global signer manager instance
export const signerManager = initializeSignerManager();

