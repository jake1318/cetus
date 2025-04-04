import { useState } from "react";
import { useCetusSdk } from "../hooks/useCetusSdk";
import { useWallet } from "../hooks/useWallet";
import { TransactionBlock } from "@mysten/sui/transactions";
import "./Modal.scss";

interface AddLiquidityModalProps {
  poolAddress: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddLiquidityModal = ({
  poolAddress,
  isOpen,
  onClose,
  onSuccess,
}: AddLiquidityModalProps) => {
  const { sdk } = useCetusSdk();
  const { account, signAndExecuteTransactionBlock } = useWallet();

  const [amountA, setAmountA] = useState<string>("");
  const [amountB, setAmountB] = useState<string>("");
  const [slippage, setSlippage] = useState<string>("0.5");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddLiquidity = async () => {
    if (!sdk || !account || !poolAddress) {
      setError("SDK or wallet not initialized");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Here you would normally construct the transaction
      // For now we'll just simulate it
      const tx = new TransactionBlock();

      // In real implementation, use the SDK to add liquidity
      // const addLiquidityPayload = await sdk.Pool.addLiquidityPayload({
      //   pool_address: poolAddress,
      //   coinTypeA: coinTypeA,
      //   coinTypeB: coinTypeB,
      //   amount_a: amountA,
      //   amount_b: amountB,
      //   slippage,
      //   tx
      // });

      console.log("Would add liquidity with:", {
        poolAddress,
        amountA,
        amountB,
        slippage,
      });

      // Simulate transaction success
      setTimeout(() => {
        setIsLoading(false);
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to add liquidity:", err);
      setError(err instanceof Error ? err.message : String(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Liquidity</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Token A Amount</label>
            <input
              type="text"
              value={amountA}
              onChange={(e) => setAmountA(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>Token B Amount</label>
            <input
              type="text"
              value={amountB}
              onChange={(e) => setAmountB(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>Slippage Tolerance (%)</label>
            <input
              type="text"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              placeholder="0.5"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="modal-footer">
          <button
            className="secondary-button"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="primary-button"
            onClick={handleAddLiquidity}
            disabled={isLoading || !amountA || !amountB}
          >
            {isLoading ? "Processing..." : "Add Liquidity"}
          </button>
        </div>
      </div>
    </div>
  );
};
