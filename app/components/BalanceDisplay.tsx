import { allChains, type ChainConfig } from "@/app/config";
import { createPublicClient, http, type Address, type PublicClient } from "viem";
import { useEffect, useState } from "react";

type ChainBalance = {
	chainKey: string;
	balance: bigint | null;
	status: "loading" | "success" | "error";
};

export default function BalanceDisplay({
	address,
	claimingStatus
}: {
	address?: Address;
	claimingStatus?: Record<string, "idle" | "claiming" | "success" | "error">;
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
			for (const chainConfig of allChains) {
				newBalances[chainConfig.chainKey] = {
					chainKey: chainConfig.chainKey,
					balance: null,
					status: "loading"
				};
			}
			setBalances(newBalances);

			// Fetch balances for all chains in parallel
			const balancePromises = allChains.map(async (chainConfig) => {
				try {
					const publicClient = createPublicClient({
						transport: http(),
						chain: chainConfig.chain
					});

					const balance = await publicClient.getBalance({
						address
					});

					return {
						chainKey: chainConfig.chainKey,
						balance,
						status: "success" as const
					};
				} catch (error) {
					console.error(`Error fetching balance for ${chainConfig.chainKey}:`, error);
					return {
						chainKey: chainConfig.chainKey,
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
	}, [address]);

	if (!address) return null;

	// Group chains by network
	const mainnetChains = allChains.filter((c) => c.network === "mainnet");
	const testnetChains = allChains.filter((c) => c.network === "testnet");

	const renderChainRow = (chainConfig: ChainConfig) => {
		const chainBalance = balances[chainConfig.chainKey];
		const balance = chainBalance?.balance ?? null;
		const balanceStatus = chainBalance?.status ?? "loading";
		const claimStatus = claimingStatus?.[chainConfig.chainKey] || "idle";

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

		return (
			<tr key={chainConfig.chainKey} className="border-b border-[black]/10 last:border-0">
				<td className="py-1.5 px-2 text-[10px] sm:text-xs text-[black] font-medium">
					{chainConfig.name.replace(" Innovation Hub", "").replace(" DeFi & Liquidity Hub", "").replace(" Gaming Hub", "").replace(" AI Hub", "")}
				</td>
				<td className="py-1.5 px-2 text-[10px] sm:text-xs text-[black] text-right">
					{balanceText && `${balanceText} sFUEL`}
				</td>
				<td className="py-1.5 px-2 text-[10px] sm:text-xs text-center">
					{statusIcon}
				</td>
			</tr>
		);
	};

	return (
		<div className="mt-4 w-full">
			{/* Mainnet Chains */}
			<div className="mb-3">
				<p className="text-[10px] sm:text-xs text-[black] font-bold mb-1.5 opacity-70">Mainnet</p>
				<div className="bg-[#d0e8ff99] rounded-lg border border-[black]/20 overflow-hidden">
					<table className="w-full text-left">
						<thead>
							<tr className="bg-[black]/5">
								<th className="py-1 px-2 text-[10px] sm:text-xs text-[black] font-bold">Chain</th>
								<th className="py-1 px-2 text-[10px] sm:text-xs text-[black] font-bold text-right">Balance</th>
								<th className="py-1 px-2 text-[10px] sm:text-xs text-[black] font-bold text-center w-8">Status</th>
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
				<p className="text-[10px] sm:text-xs text-[black] font-bold mb-1.5 opacity-70">Testnet</p>
				<div className="bg-[#d0e8ff99] rounded-lg border border-[black]/20 overflow-hidden">
					<table className="w-full text-left">
						<thead>
							<tr className="bg-[black]/5">
								<th className="py-1 px-2 text-[10px] sm:text-xs text-[black] font-bold">Chain</th>
								<th className="py-1 px-2 text-[10px] sm:text-xs text-[black] font-bold text-right">Balance</th>
								<th className="py-1 px-2 text-[10px] sm:text-xs text-[black] font-bold text-center w-8">Status</th>
							</tr>
						</thead>
						<tbody>
							{testnetChains.map(renderChainRow)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

