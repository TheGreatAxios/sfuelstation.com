"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { allChains } from "./config";
import BalanceDisplay from "./components/BalanceDisplay";
import { toast, Toaster } from "sonner";
import { DebouncedInput } from "./components/DebouncedInput";
import { useResolvedAddress } from "./hooks/useBalance";

export default function App() {
	const [inputValue, setInputValue] = useState<string>("");
	const [claimingStatus, setClaimingStatus] = useState<Record<string, "idle" | "claiming" | "success" | "error">>({});

	const { status: addressStatus, address: resolvedAddress } = useResolvedAddress(inputValue);

	const claimAllChains = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!resolvedAddress) {
			toast.error("Please enter a valid wallet address or ENS name");
			return;
		}

		// Initialize claiming status for all chains
		const initialStatus: Record<string, "idle" | "claiming" | "success" | "error"> = {};
		for (const chainConfig of allChains) {
			initialStatus[chainConfig.chainKey] = "claiming";
		}
		setClaimingStatus(initialStatus);

		try {
			// Call the API route to handle all claims server-side
			const response = await fetch("/api/claim", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					address: resolvedAddress
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to claim sFUEL");
			}

			const data = await response.json();

			// Update status for each chain based on results
			const updatedStatus: Record<string, "idle" | "claiming" | "success" | "error"> = {};
			for (const result of data.results) {
				updatedStatus[result.chainKey] = result.success ? "success" : "error";
				if (result.success) {
					toast.success(`Successfully claimed sFUEL on ${result.chainName}`);
				} else {
					toast.error(`Failed to claim on ${result.chainName}: ${result.error}`);
				}
			}

			setClaimingStatus(updatedStatus);

			// Refresh balances after a short delay
			setTimeout(() => {
				// Trigger balance refresh by updating input (this will cause BalanceDisplay to refresh)
				setInputValue((prev) => prev + " ");
				setTimeout(() => setInputValue((prev) => prev.trim()), 100);
			}, 2000);
		} catch (error: any) {
			console.error("Error claiming sFUEL:", error);
			// Set all to error state
			const errorStatus: Record<string, "idle" | "claiming" | "success" | "error"> = {};
			for (const chainConfig of allChains) {
				errorStatus[chainConfig.chainKey] = "error";
			}
			setClaimingStatus(errorStatus);
			toast.error(`Failed to claim sFUEL: ${error.message || String(error)}`);
		}
	};

	return (
		<div>
			<Navigation />
			<div className="flex justify-center mt-8 mb-4">
				<Image 
					src="/skale_logo_b.svg" 
					alt="SKALE Network" 
					width={200}
					height={100}
					priority
				/>
			</div>
			<div className="container mx-auto px-4 pt-0 pb-12 flex flex-col justify-center min-h-screen w-full sm:w-[40vw]">
				<h1 className="text-center font-medium tracking-tighter text-5xl sm:text-7xl mb-8 text-[black]">
					s<span style={{ color: "var(--accent)" }}>FUEL</span> Station
				</h1>

				<p className="text-[black] text-sm sm:text-base text-left py-2 mx-1 sm:mx-3">
					Enter wallet address or ENS Name to claim sFUEL across all SKALE chains
				</p>

				<form
					onSubmit={claimAllChains}
					className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#d0e8ff99] p-3 rounded-xl font-mono border-2 border-[black] transition-colors duration-300 focus-within:border-[#017ee1] w-full"
				>
					<DebouncedInput
						onStopTyping={(value) => {
							setInputValue(value);
						}}
					/>

					<button
						type="submit"
						disabled={!resolvedAddress || Object.values(claimingStatus).some((s) => s === "claiming")}
						className="bg-[black] text-[white] border-0 px-5 py-2 rounded-lg font-bold transition-all duration-100 hover:bg-[#017ee1] hover:-translate-y-px cursor-pointer whitespace-nowrap w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{Object.values(claimingStatus).some((s) => s === "claiming")
							? "Claiming..."
							: "Claim All Chains"}
					</button>
				</form>

				{/* Address validation message */}
				{inputValue && addressStatus === "error" && (
					<p className="text-xs text-[red] text-center mt-2">
						Invalid address or ENS name
					</p>
				)}

				{inputValue && addressStatus === "loading" && (
					<p className="text-xs text-[black] text-center mt-2 opacity-70">
						Validating address...
					</p>
				)}

				{/* Claim note */}
				<p className="text-xs text-[black] text-center mt-2 opacity-70">
					Claims sFUEL for all 8 SKALE chains
				</p>

				{/* Combined Balance and Status Display */}
				{resolvedAddress && (
					<BalanceDisplay address={resolvedAddress} claimingStatus={claimingStatus} />
				)}
			</div>

			<Footer />
			<Toaster theme="light" richColors={true} />
		</div>
	);
}

