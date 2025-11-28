import { allChains, type ChainConfig } from "@/app/config";
import { createPublicClient, http, type Address, type PublicClient } from "viem";
import { useEffect, useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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

		const chainName = chainConfig.name.replace(" Innovation Hub", "").replace(" DeFi & Liquidity Hub", "").replace(" Gaming Hub", "").replace(" AI Hub", "");
		const statusText = claimStatus === "claiming" 
			? "Claiming in progress" 
			: claimStatus === "success" 
			? "Claim successful" 
			: claimStatus === "error" 
			? "Claim failed" 
			: "Not claimed";

		return (
			<tr key={chainConfig.chainKey} className="border-b border-[black]/10 last:border-0">
				<td className="py-1.5 px-2 text-[10px] sm:text-xs text-[black] font-medium">
					<div className="flex items-center gap-1.5">
						<span>{chainName}</span>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									type="button"
									className="inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[black]/10 hover:bg-[black]/20 text-[black] text-[10px] sm:text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#017ee1] focus:ring-offset-1"
									aria-label="View all SKALE chains"
								>
									?
								</button>
							</TooltipTrigger>
							<TooltipContent 
								className="bg-[black] text-[white] text-[10px] sm:text-xs max-w-[calc(100vw-2rem)] sm:max-w-[250px] p-2 z-50"
								side="top"
								sideOffset={5}
							>
								<div className="space-y-1">
									<p className="font-semibold mb-1.5">All 8 SKALE Chains:</p>
									<ul className="list-disc list-inside space-y-0.5 text-left">
										{allChains.map((chain) => (
											<li key={chain.chainKey} className="text-[10px] sm:text-xs">
												{chain.name}
											</li>
										))}
									</ul>
								</div>
							</TooltipContent>
						</Tooltip>
					</div>
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

