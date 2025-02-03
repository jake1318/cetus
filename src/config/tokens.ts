// src/config/tokens.ts
import { PublicKey } from "@mysten/sui";

export const TOKENS = {
  SUI: {
    symbol: "SUI",
    decimals: 9,
    mint: new PublicKey("0x2::sui::SUI"),
  },
  USDC: {
    symbol: "USDC",
    decimals: 6,
    mint: new PublicKey(
      "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN"
    ),
  },
  USDT: {
    symbol: "USDT",
    decimals: 6,
    mint: new PublicKey(
      "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN"
    ),
  },
};
