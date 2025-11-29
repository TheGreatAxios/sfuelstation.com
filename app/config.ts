import {
	skaleCalypso,
	skaleCalypsoTestnet,
	skaleEuropa,
	skaleEuropaTestnet,
	skaleNebula,
	skaleNebulaTestnet,
	skaleTitan,
	skaleTitanTestnet,
	type Chain
} from "viem/chains";

// Export all chains as a simple array
export const allChains: Chain[] = [
	skaleCalypso,
	skaleCalypsoTestnet,
	skaleEuropa,
	skaleEuropaTestnet,
	skaleNebula,
	skaleNebulaTestnet,
	skaleTitan,
	skaleTitanTestnet
];

// Helper function to get chainKey from chain (e.g., "calypso-mainnet", "europa-testnet")
export function getChainKey(chain: Chain): string {
	const name = chain.name.toLowerCase();
	if (name.includes("calypso")) {
		return name.includes("testnet") ? "calypso-testnet" : "calypso-mainnet";
	}
	if (name.includes("europa")) {
		return name.includes("testnet") ? "europa-testnet" : "europa-mainnet";
	}
	if (name.includes("nebula")) {
		return name.includes("testnet") ? "nebula-testnet" : "nebula-mainnet";
	}
	if (name.includes("titan")) {
		return name.includes("testnet") ? "titan-testnet" : "titan-mainnet";
	}
	// Fallback: derive from chain id
	return `chain-${chain.id}`;
}

// Helper function to determine if a chain is mainnet or testnet
export function getChainNetwork(chain: Chain): "mainnet" | "testnet" {
	const name = chain.name.toLowerCase();
	return name.includes("testnet") ? "testnet" : "mainnet";
}

// Constants that are the same for all chains
export const DISTRIBUTION_AMOUNT = 0.0001; // Amount of sFUEL to distribute per claim
export const THRESHOLD = 0.2; // Threshold for balance checks
