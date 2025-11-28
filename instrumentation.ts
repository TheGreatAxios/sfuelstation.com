export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		// Suppress HMR ping errors in development
		process.on("unhandledRejection", (reason: unknown) => {
			if (
				reason instanceof Error &&
				reason.message.includes("unrecognized HMR message")
			) {
				// Silently ignore HMR ping errors
				return;
			}
			// Re-throw other unhandled rejections
			throw reason;
		});
	}
}

