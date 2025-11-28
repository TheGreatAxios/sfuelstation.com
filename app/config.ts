import { type Chain } from "viem";

export type ChainConfig = {
	chain: Chain;
	name: string;
	description: string;
	logoUrl: string;
	color: string;
	background: string;
	gradientBackground: string;
	threshold: number;
	network: "mainnet" | "testnet";
	chainKey: string;
	distributionAmount: number; // Amount of sFUEL to distribute per claim
};

// Calypso Mainnet
const calypsoMainnet: Chain = {
	id: 1564830818,
	name: "Calypso Innovation Hub",
	nativeCurrency: {
		name: "sFUEL",
		symbol: "sFUEL",
		decimals: 18
	},
	rpcUrls: {
		default: {
			http: ["https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague"]
		}
	},
	blockExplorers: {
		default: {
			name: "Calypso Explorer",
			url: "https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com"
		}
	}
};

// Calypso Testnet
const calypsoTestnet: Chain = {
	id: 974399131,
	name: "Calypso Testnet",
	nativeCurrency: {
		name: "sFUEL",
		symbol: "sFUEL",
		decimals: 18
	},
	rpcUrls: {
		default: {
			http: ["https://testnet.skalenodes.com/v1/giant-half-dual-testnet"]
		}
	},
	blockExplorers: {
		default: {
			name: "Calypso Testnet Explorer",
			url: "https://giant-half-dual-testnet.explorer.testnet.skalenodes.com"
		}
	}
};

// Europa Mainnet
const europaMainnet: Chain = {
	id: 2046399126,
	name: "Europa DeFi & Liquidity Hub",
	nativeCurrency: {
		name: "sFUEL",
		symbol: "sFUEL",
		decimals: 18
	},
	rpcUrls: {
		default: {
			http: ["https://mainnet.skalenodes.com/v1/elated-tan-skat"]
		}
	},
	blockExplorers: {
		default: {
			name: "Europa Explorer",
			url: "https://elated-tan-skat.explorer.mainnet.skalenodes.com"
		}
	}
};

// Europa Testnet
const europaTestnet: Chain = {
	id: 1444673419,
	name: "Europa Testnet",
	nativeCurrency: {
		name: "sFUEL",
		symbol: "sFUEL",
		decimals: 18
	},
	rpcUrls: {
		default: {
			http: ["https://testnet.skalenodes.com/v1/juicy-low-small-testnet"]
		}
	},
	blockExplorers: {
		default: {
			name: "Europa Testnet Explorer",
			url: "https://juicy-low-small-testnet.explorer.testnet.skalenodes.com"
		}
	}
};

// Nebula Mainnet
const nebulaMainnet: Chain = {
	id: 1482601649,
	name: "Nebula Gaming Hub",
	nativeCurrency: {
		name: "sFUEL",
		symbol: "sFUEL",
		decimals: 18
	},
	rpcUrls: {
		default: {
			http: ["https://mainnet.skalenodes.com/v1/green-giddy-denebola"]
		}
	},
	blockExplorers: {
		default: {
			name: "Nebula Explorer",
			url: "https://green-giddy-denebola.explorer.mainnet.skalenodes.com"
		}
	}
};

// Nebula Testnet
const nebulaTestnet: Chain = {
	id: 37084624,
	name: "Nebula Testnet",
	nativeCurrency: {
		name: "sFUEL",
		symbol: "sFUEL",
		decimals: 18
	},
	rpcUrls: {
		default: {
			http: ["https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet"]
		}
	},
	blockExplorers: {
		default: {
			name: "Nebula Testnet Explorer",
			url: "https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com"
		}
	}
};

// Titan Mainnet
const titanMainnet: Chain = {
	id: 1350216234,
	name: "Titan AI Hub",
	nativeCurrency: {
		name: "sFUEL",
		symbol: "sFUEL",
		decimals: 18
	},
	rpcUrls: {
		default: {
			http: ["https://mainnet.skalenodes.com/v1/parallel-stormy-spica"]
		}
	},
	blockExplorers: {
		default: {
			name: "Titan Explorer",
			url: "https://parallel-stormy-spica.explorer.mainnet.skalenodes.com"
		}
	}
};

// Titan Testnet
const titanTestnet: Chain = {
	id: 1020352220,
	name: "Titan Testnet",
	nativeCurrency: {
		name: "sFUEL",
		symbol: "sFUEL",
		decimals: 18
	},
	rpcUrls: {
		default: {
			http: ["https://testnet.skalenodes.com/v1/aware-fake-trim-testnet"]
		}
	},
	blockExplorers: {
		default: {
			name: "Titan Testnet Explorer",
			url: "https://aware-fake-trim-testnet.explorer.testnet.skalenodes.com"
		}
	}
};

export const allChains: ChainConfig[] = [
	// Calypso Mainnet
	{
		chain: calypsoMainnet,
		name: "Calypso Innovation Hub",
		description: "An Innovation Hub focused on projects looking to use blockchain in new and unique ways",
		logoUrl: "https://raw.githubusercontent.com/skalenetwork/skale-network/master/metadata/mainnet/logos/honorable-steel-rasalhague.png",
		color: "#FFF",
		background: "#ce126f",
		gradientBackground: "linear-gradient(270deg, rgb(103 35 71), rgb(57 15 68))",
		threshold: 0.2,
		network: "mainnet",
		chainKey: "calypso-mainnet",
		distributionAmount: 0.0001
	},
	// Calypso Testnet
	{
		chain: calypsoTestnet,
		name: "Calypso Testnet",
		description: "An Innovation Hub focused on projects looking to use blockchain in new and unique ways",
		logoUrl: "https://raw.githubusercontent.com/skalenetwork/skale-network/master/metadata/mainnet/logos/honorable-steel-rasalhague.png",
		color: "#FFF",
		background: "#ce126f",
		gradientBackground: "linear-gradient(270deg, rgb(103 35 71), rgb(57 15 68))",
		threshold: 0.2,
		network: "testnet",
		chainKey: "calypso-testnet",
		distributionAmount: 0.0001
	},
	// Europa Mainnet
	{
		chain: europaMainnet,
		name: "Europa DeFi & Liquidity Hub",
		description: "The Liquidity Hub acts as both a utility to the SKALE Ecosystem and the home of DeFi on SKALE",
		logoUrl: "https://raw.githubusercontent.com/skalenetwork/skale-network/master/metadata/mainnet/logos/elated-tan-skat.png",
		color: "#FFF",
		background: "rgb(5 19 37)",
		gradientBackground: "linear-gradient(270deg, rgb(5, 19, 37), rgb(13 36 65))",
		threshold: 0.2,
		network: "mainnet",
		chainKey: "europa-mainnet",
		distributionAmount: 0.0001
	},
	// Europa Testnet
	{
		chain: europaTestnet,
		name: "Europa Testnet",
		description: "The Liquidity Hub acts as both a utility to the SKALE Ecosystem and the home of DeFi on SKALE",
		logoUrl: "https://raw.githubusercontent.com/skalenetwork/skale-network/master/metadata/mainnet/logos/elated-tan-skat.png",
		color: "#FFF",
		background: "rgb(5 19 37)",
		gradientBackground: "linear-gradient(270deg, rgb(5, 19, 37), rgb(13 36 65))",
		threshold: 0.2,
		network: "testnet",
		chainKey: "europa-testnet",
		distributionAmount: 0.0001
	},
	// Nebula Mainnet
	{
		chain: nebulaMainnet,
		name: "Nebula Gaming Hub",
		description: "A hub focused 100% on gaming, Nebula is the home of gaming on the SKALE Network",
		logoUrl: "https://raw.githubusercontent.com/skalenetwork/skale-network/master/metadata/mainnet/logos/green-giddy-denebola.png",
		color: "#FFF",
		background: "#2c1626",
		gradientBackground: "linear-gradient(270deg, #2f1728, #1b0e17)",
		threshold: 0.2,
		network: "mainnet",
		chainKey: "nebula-mainnet",
		distributionAmount: 0.0001
	},
	// Nebula Testnet
	{
		chain: nebulaTestnet,
		name: "Nebula Testnet",
		description: "A hub focused 100% on gaming, Nebula is the home of gaming on the SKALE Network",
		logoUrl: "https://raw.githubusercontent.com/skalenetwork/skale-network/master/metadata/mainnet/logos/green-giddy-denebola.png",
		color: "#FFF",
		background: "#2c1626",
		gradientBackground: "linear-gradient(270deg, #2f1728, #1b0e17)",
		threshold: 0.2,
		network: "testnet",
		chainKey: "nebula-testnet",
		distributionAmount: 0.0001
	},
	// Titan Mainnet
	{
		chain: titanMainnet,
		name: "Titan AI Hub",
		description: "The AI Hub on SKALE is a great starting place to explore the crossover between AI and blockchain",
		logoUrl: "https://portal.skale.space/assets/parallel-stormy-spica-068cfa33.png",
		color: "#FFF",
		background: "#FFF",
		gradientBackground: "linear-gradient(270deg, rgb(72, 33, 17), rgb(34, 13, 5))",
		threshold: 0.2,
		network: "mainnet",
		chainKey: "titan-mainnet",
		distributionAmount: 0.0001
	},
	// Titan Testnet
	{
		chain: titanTestnet,
		name: "Titan Testnet",
		description: "The AI Hub on SKALE is a great starting place to explore the crossover between AI and blockchain",
		logoUrl: "https://portal.skale.space/assets/parallel-stormy-spica-068cfa33.png",
		color: "#FFF",
		background: "#FFF",
		gradientBackground: "linear-gradient(270deg, rgb(72, 33, 17), rgb(34, 13, 5))",
		threshold: 0.2,
		network: "testnet",
		chainKey: "titan-testnet",
		distributionAmount: 0.0001
	}
];

