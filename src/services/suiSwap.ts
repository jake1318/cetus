// src/services/suiSwap.ts
import { JsonRpcProvider, PublicKey, TransactionBlock } from "@mysten/sui";
import { CETUS_CLMM_PROGRAM_ID } from "../config/constants";

// Fetch pool data using Sui's getObject API.
export async function fetchPoolData(
  provider: JsonRpcProvider,
  poolId: string
): Promise<any> {
  const poolPubKey = new PublicKey(poolId);
  const response = await provider.getObject(poolPubKey);
  return response.data;
}

// Build a swap transaction using Sui's TransactionBlock.
// The Move call target is: `${CETUS_CLMM_PROGRAM_ID}::cetus_clmm::swap`.
// Parameter order: pool object, input amount, slippage, from token, to token.
export async function buildSwapTransaction(
  inputAmount: number,
  slippage: number,
  fromTokenMint: PublicKey,
  toTokenMint: PublicKey,
  poolId: string
): Promise<TransactionBlock> {
  const txb = new TransactionBlock();

  txb.moveCall({
    target: `${CETUS_CLMM_PROGRAM_ID}::cetus_clmm::swap`,
    arguments: [
      txb.object(poolId), // Pool account (poolId is a string)
      txb.pure(inputAmount), // Normalized input amount
      txb.pure(slippage), // Slippage tolerance
      txb.object(fromTokenMint.toString()), // Convert PublicKey to string
      txb.object(toTokenMint.toString()), // Convert PublicKey to string
    ],
  });

  return txb;
}
