import { useState } from "react";

export const DebouncedInput: React.FC<{
	onStopTyping: (value: string) => void;
}> = ({ onStopTyping }) => {
	const [value, setValue] = useState("");
	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setValue(newValue);

		if (timer) clearTimeout(timer);
		const newTimer = setTimeout(() => {
			onStopTyping(newValue);
		}, 500);

		setTimer(newTimer);
	};

	return (
		<>
			<label htmlFor="walletAddress" className="sr-only">
				Wallet Address or ENS Name
			</label>
			<input
				type="text"
				name="walletAddress"
				id="walletAddress"
				className="w-full sm:flex-1 bg-transparent border-0 text-[black] font-mono text-base py-1.5 px-2 outline-none focus:text-black placeholder-[#1A1A1A]/40"
				value={value}
				onChange={handleChange}
				placeholder="0x... or ENS name"
				aria-label="Enter wallet address or ENS name"
				aria-required="true"
				aria-describedby="wallet-address-description"
				autoComplete="off"
				spellCheck="false"
			/>
		</>
	);
};

