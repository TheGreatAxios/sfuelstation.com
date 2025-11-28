module.exports = [
"[project]/instrumentation.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "register",
    ()=>register
]);
async function register() {
    if ("TURBOPACK compile-time truthy", 1) {
        // Suppress HMR ping errors in development
        process.on("unhandledRejection", (reason)=>{
            if (reason instanceof Error && reason.message.includes("unrecognized HMR message")) {
                // Silently ignore HMR ping errors
                return;
            }
            // Re-throw other unhandled rejections
            throw reason;
        });
    }
}
}),
];

//# sourceMappingURL=instrumentation_ts_cf8be71b._.js.map