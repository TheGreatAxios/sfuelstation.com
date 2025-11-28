import { createPublicClient, http, isAddress, type Address } from "viem";
import { useEffect, useState } from "react";
import { mainnet } from "viem/chains";

type BalanceState = {
	status: "loading" | "success" | "error" | "idle";
	address?: Address;
	error?: string;
};

const ethPublicClient = createPublicClient({
	transport: http(),
	chain: mainnet
});

export function useResolvedAddress(
	input?: string
): BalanceState {
	const [state, setState] = useState<BalanceState>({ status: "idle" });

	useEffect(() => {
		async function resolveAddress() {
			try {
				if (!input) {
					setState({ status: "idle" });
					return;
				}

				setState({ status: "loading" });

				let resolvedAddress: Address | undefined;

				if (isAddress(input)) {
					// ✅ Case A: Valid address
					resolvedAddress = input as Address;
				} else {
					try {
						// ✅ Case B: Try ENS resolution
						const addr = await ethPublicClient.getEnsAddress({
							name: input
						});
						if (!addr) {
							setState({ status: "idle" });
							return;
						}
						resolvedAddress = addr;
					} catch {
						resolvedAddress = undefined;
					}
				}

				if (!resolvedAddress) {
					// ❌ Case C: Invalid string
					setState({
						status: "error",
						error: "Invalid address or ENS"
					});
					return;
				}

				// ✅ Case A or B: success
				setState({
					status: "success",
					address: resolvedAddress
				});
			} catch (err: any) {
				setState({ status: "error", error: err.message });
			}
		}

		resolveAddress();
	}, [input]);

	return state;
}

