// src/services/suiSwap.ts
import { JsonRpcProvider, PublicKey, TransactionBlock } from "@mysten/sui";
import { bcs } from "@mysten/bcs";
import { CETUS_CLMM_PROGRAM_ID } from "../config/constants";

/**
 * Helper to convert a Uint8Array to a hexadecimal string.
 */
function toHexString(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Workaround: the type definitions for @mysten/bcs do not include a `serialize` method,
// but at runtime bcs does have one. We cast bcs as any so we can call it.
const serialize = (bcs as any).serialize;

/**
 * Fetch pool data using Sui's getObject API.
 */
export async function fetchPoolData(
  provider: JsonRpcProvider,
  poolId: string
): Promise<any> {
  const poolPubKey = new PublicKey(poolId);
  const response = await provider.getObject(poolPubKey);
  return response.data;
}

/**
 * Build a swap transaction using Sui's TransactionBlock.
 *
 * Parameters:
 *  - inputAmount: The amount to swap (in standard units, e.g. 2 SUI)
 *  - slippage: The slippage tolerance as a percentage (e.g. 0.5 for 0.5%)
 *  - fromTokenMint: The PublicKey of the token to swap.
 *  - toTokenMint: The PublicKey of the token to receive.
 *  - poolId: The pool's account id (a string).
 *
 * This function:
 * 1. Normalizes the input amount to the smallest unit (assuming SUI uses 9 decimals).
 * 2. Converts slippage to basis points (e.g. 0.5% becomes 50).
 * 3. Serializes both values as "u64" using the BCS serializer.
 */
export async function buildSwapTransaction(
  inputAmount: number,
  slippage: number,
  fromTokenMint: PublicKey,
  toTokenMint: PublicKey,
  poolId: string
): Promise<TransactionBlock> {
  const txb = new TransactionBlock();

  // Normalize the input amount (assume SUI uses 9 decimals).
  const normalizedInput = BigInt(Math.floor(inputAmount * Math.pow(10, 9)));
  // Convert slippage to basis points (e.g. 0.5% becomes 50).
  const normalizedSlippage = BigInt(Math.floor(slippage * 100));

  // Serialize the values as u64 using the BCS serializer.
  // According to the official docs, you can call:
  //   bcs.serialize(bcs.u64, value)
  // Here we cast bcs as any to bypass the missing type declaration.
  const serializedInputBytes = serialize(bcs.u64, normalizedInput);
  const serializedSlippageBytes = serialize(bcs.u64, normalizedSlippage);

  // Convert the serialized bytes to a hex string.
  const serializedInput = toHexString(serializedInputBytes);
  const serializedSlippage = toHexString(serializedSlippageBytes);

  txb.moveCall({
    target: `${CETUS_CLMM_PROGRAM_ID}::cetus_clmm::swap`,
    arguments: [
      txb.object(poolId), // Pool account (poolId is a string)
      txb.pure(serializedInput), // Serialized input amount as hex string
      txb.pure(serializedSlippage), // Serialized slippage as hex string
      txb.object(fromTokenMint.toString()), // Convert PublicKey to string
      txb.object(toTokenMint.toString()), // Convert PublicKey to string
    ],
  });

  return txb;
}
