// src/pages/Swap.tsx
import React, { useState, useEffect } from "react";
import {
  ConnectButton,
  useWallets,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { JsonRpcProvider } from "@mysten/sui";
import { fetchPoolData, buildSwapTransaction } from "../services/suiSwap";
import { TOKENS } from "../config/tokens";
import { POOLS } from "../config/constants";
import "./swap.css";

// Helper function: Convert a Uint8Array to a hex string.
const toHexString = (byteArray: Uint8Array): string =>
  Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const Swap: React.FC = () => {
  // Retrieve the list of available wallets.
  const wallets = useWallets();
  const wallet = wallets[0];
  // Use the first account's address (if available).
  const address = wallet?.accounts[0]?.address;
  // Get the function to sign and execute transactions.
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  // Create a provider using the Sui testnet.
  const [provider] = useState(
    new JsonRpcProvider("https://fullnode.testnet.sui.io")
  );

  // Define available token pairs.
  const availablePairs = [
    { from: "SUI", to: "USDC", poolId: POOLS["SUI-USDC"] },
    { from: "SUI", to: "USDT", poolId: POOLS["SUI-USDT"] },
  ];

  const [fromToken, setFromToken] = useState("SUI");
  const [toToken, setToToken] = useState("USDC");
  const [poolId, setPoolId] = useState(POOLS["SUI-USDC"]);
  const [inputAmount, setInputAmount] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("0");
  const [error, setError] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const slippage = 0.5; // 0.5% slippage
  const [poolData, setPoolData] = useState<any>(null);

  // Update the "to" token and poolId when "fromToken" changes.
  useEffect(() => {
    const pair = availablePairs.find((p) => p.from === fromToken);
    if (pair) {
      setToToken(pair.to);
      setPoolId(pair.poolId);
    }
  }, [fromToken]);

  // Fetch pool data for the selected pool.
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPoolData(provider, poolId);
        setPoolData(data);
      } catch (err) {
        console.error("Error fetching pool data:", err);
      }
    })();
  }, [provider, poolId]);

  // Recalculate expected output when inputAmount or poolData changes.
  useEffect(() => {
    if (inputAmount && poolData) {
      // For demonstration, assume a price of 1.
      // Replace this with your real price calculation using poolData.
      const price = 1;
      const output = parseFloat(inputAmount) * price;
      setExpectedOutput(
        output.toFixed(TOKENS[toToken as keyof typeof TOKENS].decimals)
      );
    } else {
      setExpectedOutput("0");
    }
  }, [inputAmount, poolData, toToken]);

  const handleSwap = async () => {
    if (!address || !signAndExecuteTransaction) {
      setError("Please connect your wallet");
      return;
    }
    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setIsSwapping(true);
    setError("");
    try {
      const txb = await buildSwapTransaction(
        parseFloat(inputAmount),
        slippage,
        TOKENS[fromToken as keyof typeof TOKENS].mint,
        TOKENS[toToken as keyof typeof TOKENS].mint,
        poolId
      );
      const builtTx = await txb.build();
      const hexTx = toHexString(builtTx);
      const signature = await signAndExecuteTransaction({ transaction: hexTx });
      console.log("Transaction submitted:", signature);
    } catch (err: any) {
      console.error("Swap failed:", err);
      setError(err.message || "Swap failed");
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="swap-container">
      <h2>Swap Tokens</h2>
      {/* Render the connect button so the user can connect their wallet */}
      <ConnectButton />
      <div className="swap-form">
        <div className="form-group">
          <label>From Token:</label>
          <select
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
          >
            {Object.keys(TOKENS).map((token) => (
              <option key={token} value={token}>
                {TOKENS[token as keyof typeof TOKENS].symbol}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>To Token:</label>
          <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
            {availablePairs
              .filter((pair) => pair.from === fromToken)
              .map((pair) => (
                <option key={pair.to} value={pair.to}>
                  {pair.to}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label>Amount to Swap:</label>
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="0.0"
          />
        </div>
        <div className="form-group">
          <label>Expected Output:</label>
          <input type="text" value={expectedOutput} readOnly />
        </div>
        {error && <p className="error">{error}</p>}
        <button onClick={handleSwap} disabled={isSwapping}>
          {isSwapping ? "Swapping..." : "Swap"}
        </button>
      </div>
    </div>
  );
};

export default Swap;
