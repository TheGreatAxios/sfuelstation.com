import { allChains, getChainKey, getChainNetwork } from "@/app/config";
import { createPublicClient, http, type Address, type PublicClient } from "viem";
import { useEffect, useState } from "react";

type ChainBalance = {
	chainKey: string;
	balance: bigint | null;
	status: "loading" | "success" | "error";
};

export default function BalanceDisplay({
	address,
	claimingStatus,
	refreshKey
}: {
	address?: Address;
	claimingStatus?: Record<string, "idle" | "claiming" | "success" | "error">;
	refreshKey?: number;
}) {
	const [balances, setBalances] = useState<Record<string, ChainBalance>>({});

	useEffect(() => {
		if (!address) {
			setBalances({});
			return;
		}

		const fetchBalances = async () => {
			const newBalances: Record<string, ChainBalance> = {};

			// Initialize all chains as loading
			for (const chain of allChains) {
				const chainKey = getChainKey(chain);
				newBalances[chainKey] = {
					chainKey,
					balance: null,
					status: "loading"
				};
			}
			setBalances(newBalances);

			// Fetch balances for all chains in parallel
			const balancePromises = allChains.map(async (chain) => {
				const chainKey = getChainKey(chain);
				try {
					const publicClient = createPublicClient({
						transport: http(),
						chain
					});

					const balance = await publicClient.getBalance({
						address
					});

					return {
						chainKey,
						balance,
						status: "success" as const
					};
				} catch (error) {
					console.error(`Error fetching balance for ${chainKey}:`, error);
					return {
						chainKey,
						balance: null,
						status: "error" as const
					};
				}
			});

			const results = await Promise.all(balancePromises);
			const updatedBalances: Record<string, ChainBalance> = {};
			for (const result of results) {
				updatedBalances[result.chainKey] = result;
			}
			setBalances(updatedBalances);
		};

		fetchBalances();
	}, [address, refreshKey]);

	if (!address) return null;

	// Group chains by network
	const mainnetChains = allChains.filter((c) => getChainNetwork(c) === "mainnet");
	const testnetChains = allChains.filter((c) => getChainNetwork(c) === "testnet");

	const renderChainRow = (chain: typeof allChains[0]) => {
		const chainKey = getChainKey(chain);
		const chainBalance = balances[chainKey];
		const balance = chainBalance?.balance ?? null;
		const balanceStatus = chainBalance?.status ?? "loading";
		const claimStatus = claimingStatus?.[chainKey] || "idle";

		// Get status icon
		let statusIcon = "";
		if (claimStatus === "claiming") statusIcon = "⏳";
		else if (claimStatus === "success") statusIcon = "✅";
		else if (claimStatus === "error") statusIcon = "❌";

		// Get balance text
		let balanceText = "";
		if (balanceStatus === "loading") balanceText = "...";
		else if (balanceStatus === "error") balanceText = "Error";
		else if (balance !== null) {
			const balanceNum = Number(balance) / 1e18;
			balanceText = balanceNum >= 1 
				? balanceNum.toFixed(2) 
				: balanceNum.toFixed(5);
		}

		const chainName = chain.name.replace(" Innovation Hub", "").replace(" DeFi & Liquidity Hub", "").replace(" Gaming Hub", "").replace(" AI Hub", "");
		const statusText = claimStatus === "claiming" 
			? "Claiming in progress" 
			: claimStatus === "success" 
			? "Claim successful" 
			: claimStatus === "error" 
			? "Claim failed" 
			: "Not claimed";

		return (
			<tr key={chainKey} className="border-b border-[black]/10 last:border-0">
				<td className="py-1.5 px-2 text-[10px] sm:text-xs text-[black] font-medium">
					<span>{chainName}</span>
				</td>
				<td className="py-1.5 px-2 text-[10px] sm:text-xs text-[black] text-right" aria-label={`Balance for ${chainName}`}>
					{balanceText && `${balanceText} sFUEL`}
					{!balanceText && balanceStatus === "loading" && (
						<span className="sr-only">Loading balance</span>
					)}
					{!balanceText && balanceStatus === "error" && (
						<span className="sr-only">Error loading balance</span>
					)}
				</td>
				<td className="py-1.5 px-2 text-[10px] sm:text-xs text-center" aria-label={`${chainName} claim status: ${statusText}`}>
					<span aria-hidden="true">{statusIcon}</span>
					<span className="sr-only">{statusText}</span>
				</td>
			</tr>
		);
	};

	return (
		<section className="mt-4 w-full" aria-label="sFUEL balance information">
			{/* Mainnet Chains */}
			<div className="mb-3">
				<h2 className="text-[10px] sm:text-xs text-[black] font-bold mb-1.5 opacity-70">Mainnet</h2>
				<div className="bg-[#d0e8ff99] rounded-lg border border-[black]/20 overflow-hidden overflow-x-auto">
					<table className="w-full text-left min-w-[280px]" role="table" aria-label="Mainnet chain balances">
						<thead>
							<tr className="bg-[black]/5">
								<th scope="col" className="py-1 px-2 text-[10px] sm:text-xs text-[black] font-bold">Chain</th>
								<th scope="col" className="py-1 px-2 text-[10px] sm:text-xs text-[black] font-bold text-right">Balance</th>
								<th scope="col" className="py-1 px-2 text-[10px] sm:text-xs text-[black] font-bold text-center w-8" aria-label="Claim status">Status</th>
							</tr>
						</thead>
						<tbody>
							{mainnetChains.map(renderChainRow)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Testnet Chains */}
			<div>
				<h2 className="text-[10px] sm:text-xs text-[black] font-bold mb-1.5 opacity-70">Testnet</h2>
				<div className="bg-[#d0e8ff99] rounded-lg border border-[black]/20 overflow-hidden overflow-x-auto">
					<table className="w-full text-left min-w-[280px]" role="table" aria-label="Testnet chain balances">
						<thead>
							<tr className="bg-[black]/5">
								<th scope="col" className="py-1 px-2 text-[10px] sm:text-xs text-[black] font-bold">Chain</th>
								<th scope="col" className="py-1 px-2 text-[10px] sm:text-xs text-[black] font-bold text-right">Balance</th>
								<th scope="col" className="py-1 px-2 text-[10px] sm:text-xs text-[black] font-bold text-center w-8" aria-label="Claim status">Status</th>
							</tr>
						</thead>
						<tbody>
							{testnetChains.map(renderChainRow)}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}

