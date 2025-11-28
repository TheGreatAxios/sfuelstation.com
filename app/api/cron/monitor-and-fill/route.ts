import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http, parseEther, formatEther } from "viem";
import { allChains } from "../../../config";
import { Redis } from "@upstash/redis";
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

const redis = Redis.fromEnv();

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

		// Process all chains in parallel
		const chainResults = await Promise.allSettled(
			allChains.map(async (chainConfig) => {
				const chain = chainConfig.chain;
				// Use absolute threshold if set, otherwise use 20% of target (0.2 sFUEL)
				const threshold = THRESHOLD 
					? parseEther(THRESHOLD)
					: SIGNER_TARGET_BALANCE * BigInt(20) / BigInt(100); // 20% of 1 sFUEL = 0.2 sFUEL
				
				const publicClient = createPublicClient({
					transport: http(),
					chain
				});

				// Get all signer addresses and their current balances for this chain
				const signers = signerManager.getAllSigners(chain);
				const signerAddresses = signers.map(signer => signer.account.address);

				// Get all balances using individual calls (multicall doesn't work for native balance)
				const balances = await Promise.all(
					signerAddresses.map(address => publicClient.getBalance({ address: address as `0x${string}`}))
				);

				const lowBalanceSigners = [];
				const results = [];

				for (let i = 0; i < signerAddresses.length; i++) {
					const balance = balances[i];
					const address = signerAddresses[i];

					console.log(`[${chainConfig.chainKey}] Signer ${i}: ${address} - Balance: ${balance}`);

					if (balance < threshold) {
						lowBalanceSigners.push({
							index: i,
							address,
							balance: balance.toString(),
							needsTopUp: true
						});

						// Top up this signer
						await topUpSigner(i, address, balance, chain, chainConfig.chainKey);
					} else {
						results.push(`Signer ${i} (${address}) - Balance OK: ${balance}`);
					}
				}

				return {
					chainKey: chainConfig.chainKey,
					chainName: chainConfig.name,
					threshold: threshold.toString(),
					lowBalanceSigners,
					results,
					checked: signerAddresses.length
				};
			})
		);

		const processedResults = chainResults.map((result, index) => {
			if (result.status === "fulfilled") {
				return result.value;
			} else {
				return {
					chainKey: allChains[index]?.chainKey || "unknown",
					chainName: allChains[index]?.name || "Unknown",
					error: result.reason?.message || "Unknown error"
				};
			}
		});

		const totalLowBalance = processedResults.reduce((sum, r) => {
			if ('lowBalanceSigners' in r) {
				return sum + (r.lowBalanceSigners?.length || 0);
			}
			return sum;
		}, 0);
		const totalChecked = processedResults.reduce((sum, r) => {
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
	chain: typeof allChains[0]['chain'],
	chainKey: string
) {
	if (!FUNDING_WALLET_PRIVATE_KEY) {
		throw new Error("FUNDING_WALLET_PRIVATE_KEY not configured");
	}

	// Create funding wallet client and public client
	const { privateKeyToAccount } = await import("viem/accounts");
	const fundingAccount = privateKeyToAccount(FUNDING_WALLET_PRIVATE_KEY as `0x${string}`);
	const fundingWallet = createWalletClient({
		account: fundingAccount,
		transport: http(),
		chain
	});
	const publicClient = createPublicClient({
		transport: http(),
		chain
	});

	// Calculate amount to send: top up to 1 sFUEL (SIGNER_TARGET_BALANCE)
	const targetBalance = SIGNER_TARGET_BALANCE;
	const amountToSend = targetBalance - currentBalance;

	if (amountToSend <= BigInt(0)) {
		return; // Already at or above target
	}

	// Get nonce for funding wallet on this chain
	// Fetch actual nonce from chain as source of truth
	const nonceKey = `nonce:${chainKey}:funding_wallet`;
	const actualNonce = await publicClient.getTransactionCount({
		address: fundingAccount.address
	});
	const storedNonce = await redis.get<number>(nonceKey);
	
	// Use the higher of actual chain nonce or stored nonce to handle any discrepancies
	// This ensures we never use a nonce lower than what's actually on-chain
	const nonce = storedNonce !== null && storedNonce > actualNonce ? storedNonce : actualNonce;

	// Send transaction
	await fundingWallet.sendTransaction({
		to: address as `0x${string}`,
		value: amountToSend,
		nonce: nonce,
		gas: BigInt(21_000),
		gasPrice: BigInt(100_000),
		chain
	});

	// Update nonce after successful transaction
	// Since we process signers sequentially within each chain, this is safe
	await redis.set(nonceKey, nonce + 1);

	console.log(`[${chainKey}] Topped up signer ${signerIndex} (${address}) with ${amountToSend} wei using nonce ${nonce}`);
}

async function checkFundingWalletBalances(discordMessages: string[]) {
	if (!FUNDING_WALLET_PRIVATE_KEY) {
		return;
	}

	const { privateKeyToAccount } = await import("viem/accounts");
	const fundingAccount = privateKeyToAccount(FUNDING_WALLET_PRIVATE_KEY as `0x${string}`);

	// Check funding wallet balance for each chain
	const balanceChecks = await Promise.allSettled(
		allChains.map(async (chainConfig) => {
			const publicClient = createPublicClient({
				transport: http(),
				chain: chainConfig.chain
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
					`Chain: ${chainConfig.name} (${chainConfig.chainKey})\n` +
					`Address: ${fundingAccount.address}\n` +
					`Current Balance: ${balanceFormatted} sFUEL\n` +
					`20% Threshold: ${thresholdFormatted} sFUEL\n` +
					`Percentage: ${percentage.toFixed(2)}%\n` +
					`Target Balance: ${targetFormatted} sFUEL\n\n` +
					`The funding wallet balance is below 20% of the target balance. Please top up immediately.`;

				console.warn(`[${chainConfig.chainKey}] ${message}`);

				// Collect message for Discord (will be sent at the end)
				discordMessages.push(message);

				// Send email notification immediately
				await sendEmailNotification(message, fundingAccount.address, balanceFormatted, thresholdFormatted, percentage, chainConfig.name, chainConfig.chainKey);
			}

			return {
				chainKey: chainConfig.chainKey,
				chainName: chainConfig.name,
				balance: fundingBalance.toString(),
				threshold: twentyPercentThreshold.toString(),
				status: fundingBalance < twentyPercentThreshold ? "low" : "ok"
			};
		})
	);

	return balanceChecks.map((result, index) => {
		if (result.status === "fulfilled") {
			return result.value;
		} else {
			return {
				chainKey: allChains[index]?.chainKey || "unknown",
				chainName: allChains[index]?.name || "Unknown",
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

