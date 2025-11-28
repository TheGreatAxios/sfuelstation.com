module.exports = [
"[project]/.next-internal/server/app/api/claim/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/app/config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "allChains",
    ()=>allChains
]);
// Calypso Mainnet
const calypsoMainnet = {
    id: 1564830818,
    name: "Calypso Innovation Hub",
    nativeCurrency: {
        name: "sFUEL",
        symbol: "sFUEL",
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: [
                "https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague"
            ]
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
const calypsoTestnet = {
    id: 974399131,
    name: "Calypso Testnet",
    nativeCurrency: {
        name: "sFUEL",
        symbol: "sFUEL",
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: [
                "https://testnet.skalenodes.com/v1/giant-half-dual-testnet"
            ]
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
const europaMainnet = {
    id: 2046399126,
    name: "Europa DeFi & Liquidity Hub",
    nativeCurrency: {
        name: "sFUEL",
        symbol: "sFUEL",
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: [
                "https://mainnet.skalenodes.com/v1/elated-tan-skat"
            ]
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
const europaTestnet = {
    id: 1444673419,
    name: "Europa Testnet",
    nativeCurrency: {
        name: "sFUEL",
        symbol: "sFUEL",
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: [
                "https://testnet.skalenodes.com/v1/juicy-low-small-testnet"
            ]
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
const nebulaMainnet = {
    id: 1482601649,
    name: "Nebula Gaming Hub",
    nativeCurrency: {
        name: "sFUEL",
        symbol: "sFUEL",
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: [
                "https://mainnet.skalenodes.com/v1/green-giddy-denebola"
            ]
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
const nebulaTestnet = {
    id: 37084624,
    name: "Nebula Testnet",
    nativeCurrency: {
        name: "sFUEL",
        symbol: "sFUEL",
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: [
                "https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet"
            ]
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
const titanMainnet = {
    id: 1350216234,
    name: "Titan AI Hub",
    nativeCurrency: {
        name: "sFUEL",
        symbol: "sFUEL",
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: [
                "https://mainnet.skalenodes.com/v1/parallel-stormy-spica"
            ]
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
const titanTestnet = {
    id: 1020352220,
    name: "Titan Testnet",
    nativeCurrency: {
        name: "sFUEL",
        symbol: "sFUEL",
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: [
                "https://testnet.skalenodes.com/v1/aware-fake-trim-testnet"
            ]
        }
    },
    blockExplorers: {
        default: {
            name: "Titan Testnet Explorer",
            url: "https://aware-fake-trim-testnet.explorer.testnet.skalenodes.com"
        }
    }
};
const allChains = [
    // Calypso Mainnet
    {
        chain: calypsoMainnet,
        name: "Calypso Innovation Hub",
        description: "An Innovation Hub focused on projects looking to use blockchain in new and unique ways",
        logoUrl: "https://raw.githubusercontent.com/skalenetwork/skale-network/master/metadata/mainnet/logos/honorable-steel-rasalhague.png",
        color: "#FFF",
        background: "#ce126f",
        gradientBackground: "linear-gradient(270deg, rgb(103 35 71), rgb(57 15 68))",
        proofOfWork: "0x02891b34B7911A9C68e82C193cd7A6fBf0c3b30A",
        threshold: 0.005,
        network: "mainnet",
        chainKey: "calypso-mainnet",
        functionSignature: "0x0c11dedd"
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
        proofOfWork: "0x62Fe932FF26e0087Ae383f6080bd2Ed481bA5A8A",
        threshold: 0.5,
        network: "testnet",
        chainKey: "calypso-testnet",
        functionSignature: "0x0c11dedd"
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
        proofOfWork: "0x2B267A3e49b351DEdac892400a530ABb2f899d23",
        threshold: 0.1,
        network: "mainnet",
        chainKey: "europa-mainnet",
        functionSignature: "0x6a627842" // Europa mainnet uses mint function
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
        proofOfWork: "0x366727B410fE55774C8b0B5b5A6E2d74199a088A",
        threshold: 0.5,
        network: "testnet",
        chainKey: "europa-testnet",
        functionSignature: "0x0c11dedd"
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
        proofOfWork: "0x5a6869ef5b81DCb58EBF51b8F893c31f5AFE3Fa8",
        threshold: 0.0001,
        network: "mainnet",
        chainKey: "nebula-mainnet",
        functionSignature: "0x0c11dedd"
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
        proofOfWork: "0x000E9c53C4e2e21F5063f2e232d0AA907318dccb",
        threshold: 0.5,
        network: "testnet",
        chainKey: "nebula-testnet",
        functionSignature: "0x0c11dedd"
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
        proofOfWork: "0xa5C297dF8f8386E4b940D61EF9A8f2bB367a6fAB",
        threshold: 0.005,
        network: "mainnet",
        chainKey: "titan-mainnet",
        functionSignature: "0x0c11dedd"
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
        proofOfWork: "0x08f98Af60eb83C18184231591A8F89577E46A4B9",
        threshold: 0.5,
        network: "testnet",
        chainKey: "titan-testnet",
        functionSignature: "0x0c11dedd"
    }
];
}),
"[project]/app/utils/signers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MultiSignerManager",
    ()=>MultiSignerManager,
    "getAndIncrementNonce",
    ()=>getAndIncrementNonce,
    "getNextSignerIndex",
    ()=>getNextSignerIndex,
    "initializeSignerManager",
    ()=>initializeSignerManager,
    "signerManager",
    ()=>signerManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$accounts$2f$mnemonicToAccount$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.40.3_typescript@5.9.3/node_modules/viem/_esm/accounts/mnemonicToAccount.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$createWalletClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.40.3_typescript@5.9.3/node_modules/viem/_esm/clients/createWalletClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.40.3_typescript@5.9.3/node_modules/viem/_esm/clients/transports/http.js [app-route] (ecmascript)");
;
;
class MultiSignerManager {
    mnemonic;
    maxSigners;
    constructor(mnemonic, maxSigners){
        this.mnemonic = mnemonic;
        this.maxSigners = maxSigners;
    }
    /**
	 * Get a wallet client for a specific signer index and chain
	 */ getSigner(signerIndex, chain) {
        if (signerIndex < 0 || signerIndex >= this.maxSigners) {
            throw new Error(`Signer index out of range: ${signerIndex}`);
        }
        const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$accounts$2f$mnemonicToAccount$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mnemonicToAccount"])(this.mnemonic, {
            addressIndex: signerIndex
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$createWalletClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createWalletClient"])({
            account,
            transport: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["http"])(),
            chain
        });
    }
    /**
	 * Get all signers for a specific chain
	 */ getAllSigners(chain) {
        const signers = [];
        for(let i = 0; i < this.maxSigners; i++){
            signers.push(this.getSigner(i, chain));
        }
        return signers;
    }
    /**
	 * Get the maximum number of signers
	 */ getMaxSigners() {
        return this.maxSigners;
    }
}
async function getNextSignerIndex(redis, key = "current_signer_index") {
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
async function getAndIncrementNonce(redis, signerIndex, chainId) {
    const nonceKey = `nonce:signer:${signerIndex}:chain:${chainId}`;
    const currentNonce = await redis.get(nonceKey);
    const nonce = currentNonce ? Number(currentNonce) : 0;
    // Increment nonce for next transaction
    await redis.set(nonceKey, nonce + 1);
    return nonce;
}
function initializeSignerManager() {
    const mnemonic = process.env.MNEMONIC;
    if (!mnemonic) {
        throw new Error("MNEMONIC environment variable is required");
    }
    const maxSigners = parseInt(process.env.MAX_SIGNERS || "10");
    return new MultiSignerManager(mnemonic, maxSigners);
}
const signerManager = initializeSignerManager();
}),
"[project]/app/api/claim/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$createPublicClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.40.3_typescript@5.9.3/node_modules/viem/_esm/clients/createPublicClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.40.3_typescript@5.9.3/node_modules/viem/_esm/utils/address/getAddress.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.40.3_typescript@5.9.3/node_modules/viem/_esm/clients/transports/http.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$isAddress$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.40.3_typescript@5.9.3/node_modules/viem/_esm/utils/address/isAddress.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$mainnet$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.40.3_typescript@5.9.3/node_modules/viem/_esm/chains/definitions/mainnet.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$upstash$2b$redis$40$1$2e$35$2e$7$2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@upstash+redis@1.35.7/node_modules/@upstash/redis/nodejs.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$signers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/signers.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const redis = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$upstash$2b$redis$40$1$2e$35$2e$7$2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Redis"].fromEnv();
const ethPublicClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$createPublicClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createPublicClient"])({
    transport: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["http"])(),
    chain: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$mainnet$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mainnet"]
});
const GAS_LIMIT = 100_000n;
const GAS_PRICE = 10_000_000_000n; // 10 gwei
async function POST(request) {
    try {
        const body = await request.json();
        const { address } = body;
        if (!address) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required parameter: address"
            }, {
                status: 400
            });
        }
        // Resolve address (handle ENS)
        let resolvedAddress;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$isAddress$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAddress"])(address)) {
            const _resolvedAddress = await ethPublicClient.getEnsAddress({
                name: address
            });
            if (!_resolvedAddress) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Invalid wallet address or ENS Name"
                }, {
                    status: 400
                });
            }
            resolvedAddress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAddress"])(_resolvedAddress);
        } else {
            resolvedAddress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$address$2f$getAddress$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAddress"])(address);
        }
        // Process all chains in parallel
        const claimPromises = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["allChains"].map(async (chainConfig)=>{
            try {
                // Get next signer index and wallet for this transaction
                const signerIndex = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$signers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getNextSignerIndex"])(redis);
                const wallet = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$signers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signerManager"].getSigner(signerIndex, chainConfig.chain);
                // Get and increment nonce for this signer on this chain
                const nonce = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$signers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAndIncrementNonce"])(redis, signerIndex, chainConfig.chain.id);
                // Create public client for this chain
                const publicClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$createPublicClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createPublicClient"])({
                    transport: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$40$2e$3_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["http"])(),
                    chain: chainConfig.chain
                });
                // Prepare transaction data
                // Encode recipient address as last 20 bytes (remove 0x prefix)
                const recipientAddress = resolvedAddress.substring(2).toLowerCase();
                const data = `${chainConfig.functionSignature}000000000000000000000000${recipientAddress}`;
                // Send transaction
                const hash = await wallet.sendTransaction({
                    to: chainConfig.proofOfWork,
                    data,
                    gas: GAS_LIMIT,
                    gasPrice: GAS_PRICE,
                    nonce
                });
                // Wait for transaction receipt
                await publicClient.waitForTransactionReceipt({
                    hash
                });
                return {
                    chainKey: chainConfig.chainKey,
                    chainName: chainConfig.name,
                    success: true,
                    hash
                };
            } catch (error) {
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
        const claimResults = results.map((result)=>result.status === "fulfilled" ? result.value : {
                success: false,
                error: "Promise rejected"
            });
        const successful = claimResults.filter((r)=>r.success).length;
        const failed = claimResults.filter((r)=>!r.success).length;
        // If all claims failed, return appropriate error status
        if (failed === __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["allChains"].length) {
            // Check if it's a user input error (unlikely at this point, but check anyway)
            const firstError = claimResults.find((r)=>!r.success)?.error || "";
            const isUserInputError = firstError.toLowerCase().includes("invalid") || firstError.toLowerCase().includes("missing") || firstError.toLowerCase().includes("required");
            if (isUserInputError) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "User input error",
                    details: claimResults.filter((r)=>!r.success).map((r)=>({
                            chain: r.chainName,
                            error: r.error
                        }))
                }, {
                    status: 400
                });
            }
            // Otherwise, it's a server/transaction error
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to process transactions",
                details: claimResults.filter((r)=>!r.success).map((r)=>({
                        chain: r.chainName,
                        error: r.error
                    }))
            }, {
                status: 500
            });
        }
        // Return results with 200 status (partial success is still success)
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: failed === 0,
            results: claimResults,
            summary: {
                total: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["allChains"].length,
                successful,
                failed
            }
        });
    } catch (error) {
        console.error("Error in claim API:", error);
        // Determine if it's a user input error or server error
        const errorMessage = error.message || String(error);
        const isUserInputError = errorMessage.toLowerCase().includes("invalid") || errorMessage.toLowerCase().includes("missing") || errorMessage.toLowerCase().includes("required") || errorMessage.toLowerCase().includes("bad request");
        if (isUserInputError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User input error",
                details: errorMessage
            }, {
                status: 400
            });
        }
        // Default to 500 for server errors, transaction issues, out of gas, etc.
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to process claim",
            details: errorMessage
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e634ea23._.js.map