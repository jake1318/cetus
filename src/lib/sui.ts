// src/lib/sui.ts
import { SuiClient } from "@mysten/sui/client";
import { Transaction as SuiTransaction } from "@mysten/sui/transactions";
import { PublicKey as PublicKeyShim } from "./PublicKeyShim";

// Re-export the SuiClient as our JsonRpcProvider.
export const JsonRpcProvider = SuiClient;
// The SDK exports the transaction builder as "Transaction"; we alias it as TransactionBlock.
export const TransactionBlock = SuiTransaction;
// Re-export our shim as PublicKey.
export { PublicKeyShim as PublicKey };
