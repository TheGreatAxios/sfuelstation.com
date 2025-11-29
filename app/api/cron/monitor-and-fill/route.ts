import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http, parseEther, formatEther } from "viem";
import { nonceManager } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { allChains, getChainKey } from "../../../config";
import { signerManager } from "../../../utils/signers";
import { Resend } from "resend";

// Environment variables
const THRESHOLD = process.env.SIGNER_THRESHOLD || ""; // If set, use this as absolute threshold, otherwise use chain threshold
const SIGNER_TARGET_BALANCE = parseEther(process.env.SIGNER_TARGET_BALANCE || "1"); // Default 1 sFUEL per signer
const FUNDING_WALLET_PRIVATE_KEY = process.env.FUNDING_WALLET_PRIVATE_KEY;
const MAX_SIGNERS = parseInt(process.env.MAX_SIGNERS || "10");
const FUNDING_WALLET_TARGET = parseEther(process.env.FUNDING_WALLET_TARGET || "30"); // Default 30 sFUEL for funding wallet
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@example.com";

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get('authorization');
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response('Unauthorized', {
			status: 401,
		});
	}
	
	try {
		if (!FUNDING_WALLET_PRIVATE_KEY) {
			return NextResponse.json({ error: "FUNDING_WALLET_PRIVATE_KEY not configured" }, { status: 500 });
		}

		console.log(`Starting balance check for ${MAX_SIGNERS} signers across ${allChains.length} chains`);

		// Collect all Discord messages to send at the end
		const discordMessages: string[] = [];

		// Check funding wallet balance for all chains
		const fundingWalletResults = await checkFundingWalletBalances(discordMessages);

		// Calculate threshold once (same for all chains)
		const threshold = THRESHOLD 
			? parseEther(THRESHOLD)
			: SIGNER_TARGET_BALANCE * BigInt(20) / BigInt(100); // 20% of 1 sFUEL = 0.2 sFUEL

		// Batch ALL balance requests across all chains and signers in a single Promise.all
		type BalanceRequest = {
			chain: typeof allChains[0];
			chainKey: string;
			signerIndex: number;
			address: string;
		};

		const balanceRequests: BalanceRequest[] = [];
		for (const chain of allChains) {
			const chainKey = getChainKey(chain);
			const signers = signerManager.getAllSigners(chain);
			const signerAddresses = signers.map(signer => signer.account.address);
			
			for (let i = 0; i < signerAddresses.length; i++) {
				balanceRequests.push({
					chain,
					chainKey,
					signerIndex: i,
					address: signerAddresses[i]
				});
			}
		}

		console.log(`Fetching ${balanceRequests.length} balances across ${allChains.length} chains...`);

		// Fetch all balances in parallel
		const balanceResults = await Promise.allSettled(
			balanceRequests.map(async ({ chain, address }) => {
				const publicClient = createPublicClient({
					transport: http(),
					chain
				});
				return await publicClient.getBalance({ address: address as `0x${string}` });
			})
		);

		// Process results and identify signers that need top-up
		const signersNeedingTopUp: Array<{
			chain: typeof allChains[0];
			chainKey: string;
			signerIndex: number;
			address: string;
			balance: bigint;
		}> = [];

		const chainResults = new Map<string, {
			chainKey: string;
			chainName: string;
			threshold: string;
			lowBalanceSigners: Array<{
				index: number;
				address: string;
				balance: string;
				needsTopUp: boolean;
				error?: string;
				topUpFailed?: boolean;
			}>;
			results: string[];
			checked: number;
		}>();

		// Initialize chain results
		for (const chain of allChains) {
			const chainKey = getChainKey(chain);
			chainResults.set(chainKey, {
				chainKey,
				chainName: chain.name,
				threshold: threshold.toString(),
				lowBalanceSigners: [],
				results: [],
				checked: 0
			});
		}

		// Process balance results
		for (let i = 0; i < balanceRequests.length; i++) {
			const request = balanceRequests[i];
			const result = balanceResults[i];
			const chainResult = chainResults.get(request.chainKey)!;

			if (result.status === "fulfilled") {
				const balance = result.value;
				chainResult.checked++;
				
				console.log(`[${request.chainKey}] Signer ${request.signerIndex}: ${request.address} - Balance: ${formatEther(balance)} sFUEL`);

				if (balance < threshold) {
					const signerInfo = {
						index: request.signerIndex,
						address: request.address,
						balance: balance.toString(),
						needsTopUp: true
					};
					chainResult.lowBalanceSigners.push(signerInfo);
					signersNeedingTopUp.push({
						chain: request.chain,
						chainKey: request.chainKey,
						signerIndex: request.signerIndex,
						address: request.address,
						balance
					});
				} else {
					chainResult.results.push(`Signer ${request.signerIndex} (${request.address}) - Balance OK: ${formatEther(balance)} sFUEL`);
				}
			} else {
				chainResult.checked++;
				const errorMsg = result.reason?.message || "Unknown error";
				console.error(`[${request.chainKey}] Failed to fetch balance for signer ${request.signerIndex} (${request.address}):`, errorMsg);
				chainResult.results.push(`Signer ${request.signerIndex} (${request.address}) - Balance fetch failed: ${errorMsg}`);
			}
		}

		// Process top-ups sequentially per chain (nonceManager handles nonce incrementing automatically)
		console.log(`Processing ${signersNeedingTopUp.length} top-ups...`);
		
		// Group by chain to process sequentially per chain
		const topUpsByChain = new Map<string, typeof signersNeedingTopUp>();
		for (const signer of signersNeedingTopUp) {
			if (!topUpsByChain.has(signer.chainKey)) {
				topUpsByChain.set(signer.chainKey, []);
			}
			topUpsByChain.get(signer.chainKey)!.push(signer);
		}

		// Process top-ups per chain (parallel chains, sequential within each chain)
		await Promise.allSettled(
			Array.from(topUpsByChain.entries()).map(async ([chainKey, signers]) => {
				const chain = signers[0].chain;
				const chainResult = chainResults.get(chainKey)!;

				for (const signer of signers) {
					const signerInfo = chainResult.lowBalanceSigners.find(
						s => s.index === signer.signerIndex && s.address === signer.address
					)!;

					try {
						await topUpSigner(
							signer.signerIndex,
							signer.address,
							signer.balance,
							chain,
							chainKey
						);
						chainResult.results.push(`Signer ${signer.signerIndex} (${signer.address}) - Topped up successfully`);
					} catch (error: any) {
						const errorMsg = error?.message || String(error);
						console.error(`[${chainKey}] Failed to top up signer ${signer.signerIndex} (${signer.address}):`, errorMsg);
						chainResult.results.push(`Signer ${signer.signerIndex} (${signer.address}) - Top-up failed: ${errorMsg}`);
						signerInfo.error = errorMsg;
						signerInfo.topUpFailed = true;
					}
				}
			})
		);

		const processedResults = Array.from(chainResults.values());

		const totalLowBalance = processedResults.reduce((sum: number, r: any) => {
			if ('lowBalanceSigners' in r) {
				return sum + (r.lowBalanceSigners?.length || 0);
			}
			return sum;
		}, 0);
		const totalChecked = processedResults.reduce((sum: number, r: any) => {
			if ('checked' in r) {
				return sum + (r.checked || 0);
			}
			return sum;
		}, 0);

		// Send single Discord message at the end if there are any messages
		if (discordMessages.length > 0) {
			const combinedMessage = discordMessages.join("\n\n");
			await sendDiscordNotification(combinedMessage);
		}

		return NextResponse.json({
			success: true,
			message: `Checked ${totalChecked} signers across ${allChains.length} chains. ${totalLowBalance} needed top-up.`,
			results: processedResults,
			summary: {
				totalChains: allChains.length,
				totalSigners: totalChecked,
				totalLowBalance
			},
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error("Error in monitor-and-fill:", error);
		return NextResponse.json({
			error: "Internal server error",
			message: error instanceof Error ? error.message : "Unknown error"
		}, { status: 500 });
	}
}

async function topUpSigner(
	signerIndex: number,
	address: string,
	currentBalance: bigint,
	chain: typeof allChains[0],
	chainKey: string
) {
	if (!FUNDING_WALLET_PRIVATE_KEY) {
		throw new Error("FUNDING_WALLET_PRIVATE_KEY not configured");
	}

	// Create funding wallet client and public client
	const fundingAccount = privateKeyToAccount(FUNDING_WALLET_PRIVATE_KEY as `0x${string}`, {
		nonceManager
	});
	const rpcUrl = chain.rpcUrls.default.http[0];
	const fundingWallet = createWalletClient({
		account: fundingAccount,
		transport: http(rpcUrl),
		chain
	});
	const publicClient = createPublicClient({
		transport: http(rpcUrl),
		chain
	});

	// Check funding wallet balance first
	const fundingBalance = await publicClient.getBalance({
		address: fundingAccount.address
	});

	// Calculate amount to send: top up to 1 sFUEL (SIGNER_TARGET_BALANCE)
	const targetBalance = SIGNER_TARGET_BALANCE;
	const amountToSend = targetBalance - currentBalance;

	if (amountToSend <= BigInt(0)) {
		console.log(`[${chainKey}] Signer ${signerIndex} (${address}) already at or above target balance`);
		return; // Already at or above target
	}

	// Calculate required gas cost
	const gasLimit = BigInt(21_000);
	const gasPrice = BigInt(100_000);
	const gasCost = gasLimit * gasPrice;
	const totalRequired = amountToSend + gasCost;

	// Check if funding wallet has enough balance
	if (fundingBalance < totalRequired) {
		const errorMsg = `Funding wallet balance (${formatEther(fundingBalance)} sFUEL) is insufficient. Required: ${formatEther(totalRequired)} sFUEL (${formatEther(amountToSend)} + ${formatEther(gasCost)} gas)`;
		console.error(`[${chainKey}] ${errorMsg}`);
		throw new Error(errorMsg);
	}

	// NonceManager automatically handles nonce incrementing, so we don't need to specify nonce
	console.log(`[${chainKey}] Topping up signer ${signerIndex} (${address}) with ${formatEther(amountToSend)} sFUEL`);

	// Send transaction (nonceManager will automatically handle nonce)
	try {
		const hash = await fundingWallet.sendTransaction({
			to: address as `0x${string}`,
			value: amountToSend,
			gas: gasLimit,
			gasPrice: gasPrice,
			chain
		});

		// Wait for transaction receipt
		const receipt = await publicClient.waitForTransactionReceipt({ hash });

		console.log(`[${chainKey}] Successfully topped up signer ${signerIndex} (${address}) with ${formatEther(amountToSend)} sFUEL. Tx: ${hash}`);
	} catch (error: any) {
		const errorMsg = error?.message || String(error);
		console.error(`[${chainKey}] Transaction failed for signer ${signerIndex} (${address}):`, errorMsg);
		throw new Error(`Failed to send transaction: ${errorMsg}`);
	}
}

async function checkFundingWalletBalances(discordMessages: string[]) {
	if (!FUNDING_WALLET_PRIVATE_KEY) {
		return;
	}

	const fundingAccount = privateKeyToAccount(FUNDING_WALLET_PRIVATE_KEY as `0x${string}`);

	// Check funding wallet balance for each chain
	const balanceChecks = await Promise.allSettled(
		allChains.map(async (chain) => {
			const chainKey = getChainKey(chain);
			const publicClient = createPublicClient({
				transport: http(),
				chain
			});

			// Get funding wallet balance
			const fundingBalance = await publicClient.getBalance({ 
				address: fundingAccount.address 
			});

			// Alert threshold: 20% of 30 sFUEL = 6 sFUEL
			const twentyPercentThreshold = (FUNDING_WALLET_TARGET * BigInt(20)) / BigInt(100);

			if (fundingBalance < twentyPercentThreshold) {
				const balanceFormatted = formatEther(fundingBalance);
				const thresholdFormatted = formatEther(twentyPercentThreshold);
				const targetFormatted = formatEther(FUNDING_WALLET_TARGET);
				const percentage = (Number(fundingBalance) / Number(FUNDING_WALLET_TARGET)) * 100;

				const message = `⚠️ Funding Wallet Balance Alert\n\n` +
					`Chain: ${chain.name} (${chainKey})\n` +
					`Address: ${fundingAccount.address}\n` +
					`Current Balance: ${balanceFormatted} sFUEL\n` +
					`20% Threshold: ${thresholdFormatted} sFUEL\n` +
					`Percentage: ${percentage.toFixed(2)}%\n` +
					`Target Balance: ${targetFormatted} sFUEL\n\n` +
					`The funding wallet balance is below 20% of the target balance. Please top up immediately.`;

				console.warn(`[${chainKey}] ${message}`);

				// Collect message for Discord (will be sent at the end)
				discordMessages.push(message);

				// Send email notification immediately
				await sendEmailNotification(message, fundingAccount.address, balanceFormatted, thresholdFormatted, percentage, chain.name, chainKey);
			}

			return {
				chainKey,
				chainName: chain.name,
				balance: fundingBalance.toString(),
				threshold: twentyPercentThreshold.toString(),
				status: fundingBalance < twentyPercentThreshold ? "low" : "ok"
			};
		})
	);

	return balanceChecks.map((result: PromiseSettledResult<any>, index: number) => {
		if (result.status === "fulfilled") {
			return result.value;
		} else {
			const chain = allChains[index];
			return {
				chainKey: chain ? getChainKey(chain) : "unknown",
				chainName: chain?.name || "Unknown",
				error: result.reason?.message || "Unknown error"
			};
		}
	});
}

async function sendDiscordNotification(message: string) {
	if (!DISCORD_WEBHOOK_URL) {
		console.warn("DISCORD_WEBHOOK_URL not configured, skipping Discord notification");
		return;
	}

	try {
		const response = await fetch(DISCORD_WEBHOOK_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: message,
			}),
		});

		if (!response.ok) {
			console.error(`Discord webhook failed: ${response.status} ${response.statusText}`);
		} else {
			console.log(`Discord notification sent successfully`);
		}
	} catch (error) {
		console.error(`Error sending Discord notification:`, error);
	}
}

async function sendEmailNotification(
	message: string,
	address: string,
	balance: string,
	threshold: string,
	percentage: number,
	chainName: string,
	chainKey: string
) {
	if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
		console.warn("RESEND_API_KEY or NOTIFICATION_EMAIL not configured, skipping email notification");
		return;
	}

	try {
		const resend = new Resend(RESEND_API_KEY);

		await resend.emails.send({
			from: RESEND_FROM_EMAIL,
			to: NOTIFICATION_EMAIL,
			subject: `⚠️ Funding Wallet Balance Alert - ${chainName}`,
			html: `
				<h2>Funding Wallet Balance Alert</h2>
				<p><strong>Chain:</strong> ${chainName} (${chainKey})</p>
				<p><strong>Address:</strong> <code>${address}</code></p>
				<p><strong>Current Balance:</strong> ${balance} sFUEL</p>
				<p><strong>20% Threshold:</strong> ${threshold} sFUEL</p>
				<p><strong>Percentage:</strong> ${percentage.toFixed(2)}%</p>
				<p>The funding wallet balance is below 20% of the target balance. Please top up immediately.</p>
				<hr>
				<pre style="background: #f4f4f4; padding: 10px; border-radius: 4px;">${message}</pre>
			`,
		});

		console.log(`[${chainKey}] Email notification sent successfully`);
	} catch (error) {
		console.error(`[${chainKey}] Error sending email notification:`, error);
	}
}

// Health check endpoint for cron monitoring
export async function POST(request: NextRequest) {
	return NextResponse.json({
		status: "healthy",
		timestamp: new Date().toISOString(),
		service: "sfuelstation-monitor"
	});
}

