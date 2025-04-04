import { useState } from "react";
import { useCetusSdk } from "../hooks/useCetusSdk";
import { useWallet } from "../hooks/useWallet";
import { TransactionBlock } from "@mysten/sui/transactions";
import "./Modal.scss";

interface RemoveLiquidityModalProps {
  poolAddress: string;
  positionId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RemoveLiquidityModal = ({
  poolAddress,
  positionId,
  isOpen,
  onClose,
  onSuccess,
}: RemoveLiquidityModalProps) => {
  const { sdk } = useCetusSdk();
  const { account, signAndExecuteTransactionBlock } = useWallet();

  const [percentage, setPercentage] = useState<string>("100");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRemoveLiquidity = async () => {
    if (!sdk || !account || !poolAddress || !positionId) {
      setError("SDK, wallet not initialized, or position not selected");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Here you would normally construct the transaction
      // For now we'll just simulate it
      const tx = new TransactionBlock();

      // In real implementation, use the SDK to remove liquidity
      // const removeLiquidityPayload = await sdk.Position.removeLiquidityPayload({
      //   positionId,
      //   percentage: Number(percentage),
      //   tx
      // });

      console.log("Would remove liquidity with:", {
        poolAddress,
        positionId,
        percentage,
      });

      // Simulate transaction success
      setTimeout(() => {
        setIsLoading(false);
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to remove liquidity:", err);
      setError(err instanceof Error ? err.message : String(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Remove Liquidity</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Position ID</label>
            <input
              type="text"
              value={positionId || ""}
              disabled
              placeholder="Position ID"
            />
          </div>

          <div className="form-group">
            <label>Percentage to Remove (%)</label>
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min="1"
              max="100"
              placeholder="100"
            />
          </div>

          <div className="percentage-slider">
            {[25, 50, 75, 100].map((value) => (
              <button
                key={value}
                className={`slider-button ${
                  percentage === String(value) ? "active" : ""
                }`}
                onClick={() => setPercentage(String(value))}
              >
                {value}%
              </button>
            ))}
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
            onClick={handleRemoveLiquidity}
            disabled={isLoading || !positionId}
          >
            {isLoading ? "Processing..." : "Remove Liquidity"}
          </button>
        </div>
      </div>
    </div>
  );
};
