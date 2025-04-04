import { useState } from "react";
import { Modal } from "./Modal";
import { useCetusSdk } from "../hooks/useCetusSdk";
import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from "@suiet/wallet-kit";
import "./AddLiquidityModal.scss";

interface AddLiquidityModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolAddress: string;
  tokenASymbol: string;
  tokenBSymbol: string;
}

export const AddLiquidityModal = ({
  isOpen,
  onClose,
  poolAddress,
  tokenASymbol,
  tokenBSymbol,
}: AddLiquidityModalProps) => {
  const [tokenAAmount, setTokenAAmount] = useState("");
  const [tokenBAmount, setTokenBAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [loading, setLoading] = useState(false);

  const { sdk } = useCetusSdk();
  const account = useCurrentAccount();
  const { signAndExecute } = useSignAndExecuteTransactionBlock();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sdk || !account || !poolAddress) return;

    try {
      setLoading(true);

      // Get pool details
      const pool = await sdk.Pool.getPool(poolAddress);

      // This is a simplified example - in a real app you'd use the SDK methods
      // with proper calculations for token amounts, slippage, etc.
      console.log("Would add liquidity with:", {
        poolAddress,
        tokenAAmount,
        tokenBAmount,
        slippage,
      });

      // Mock transaction for now - would be replaced with actual SDK calls
      /*
      const liquidityResult = await sdk.Position.createPosition({
        pool,
        coinTypeA: pool.coinTypeA,
        coinTypeB: pool.coinTypeB,
        amountA: tokenAAmount,
        amountB: tokenBAmount,
        slippage: parseFloat(slippage),
        tickLowerPrice: ..., // Would need calculation based on price
        tickUpperPrice: ..., // Would need calculation based on price
      });
      
      const payloadParams = liquidityResult.createPositionParams;
      // For older @mysten/sui versions, use
      const txb = await sdk.Transaction.createTransaction(...);
      const txResult = await signAndExecute({
        transactionBlock: txb
      });
      */

      console.log("Transaction would be executed here");

      // Close the modal on success
      onClose();
    } catch (error) {
      console.error("Error adding liquidity:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Liquidity">
      <form onSubmit={handleSubmit} className="add-liquidity-form">
        <div className="form-group">
          <label htmlFor="tokenAAmount">{tokenASymbol} Amount</label>
          <input
            id="tokenAAmount"
            type="text"
            value={tokenAAmount}
            onChange={(e) => setTokenAAmount(e.target.value)}
            placeholder={`Enter ${tokenASymbol} amount`}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tokenBAmount">{tokenBSymbol} Amount</label>
          <input
            id="tokenBAmount"
            type="text"
            value={tokenBAmount}
            onChange={(e) => setTokenBAmount(e.target.value)}
            placeholder={`Enter ${tokenBSymbol} amount`}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="slippage">Slippage Tolerance (%)</label>
          <input
            id="slippage"
            type="text"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            placeholder="Slippage tolerance"
            required
          />
        </div>

        <div className="slippage-presets">
          <button type="button" onClick={() => setSlippage("0.1")}>
            0.1%
          </button>
          <button type="button" onClick={() => setSlippage("0.5")}>
            0.5%
          </button>
          <button type="button" onClick={() => setSlippage("1.0")}>
            1.0%
          </button>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!account || loading}
        >
          {loading ? "Processing..." : "Add Liquidity"}
        </button>

        {!account && (
          <div className="warning-message">
            Please connect your wallet first
          </div>
        )}
      </form>
    </Modal>
  );
};
