import { useNavigate } from "react-router-dom";
import "./PoolCard.scss";

interface PoolCardProps {
  poolAddress: string;
  index: number;
  poolData?: any;
}

export const PoolCard = ({ poolAddress, index, poolData }: PoolCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pool/${poolAddress}`);
  };

  return (
    <div className="pool-card" onClick={handleClick}>
      <h3>Pool {index + 1}</h3>
      <p className="pool-address">
        {poolAddress.substring(0, 10)}...
        {poolAddress.substring(poolAddress.length - 10)}
      </p>
      {poolData && (
        <div className="pool-details">
          <div className="token-pair">
            <span className="token-a">
              {poolData.tokenASymbol || "Token A"}
            </span>
            <span className="separator">/</span>
            <span className="token-b">
              {poolData.tokenBSymbol || "Token B"}
            </span>
          </div>
          {poolData.feeRate && (
            <div className="fee-rate">
              Fee: {(Number(poolData.feeRate) / 10000).toFixed(2)}%
            </div>
          )}
        </div>
      )}
    </div>
  );
};
