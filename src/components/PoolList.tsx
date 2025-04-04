import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCetusSdk } from "../hooks/useCetusSdk";
import "./PoolList.scss";

export const PoolList = () => {
  const { sdk, isLoading, error } = useCetusSdk();
  const [pools, setPools] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPools = async () => {
      if (!sdk) return;

      try {
        const pools = await sdk.Pool.getPoolsWithPage(0, 100);
        setPools(pools.poolAddresses);
      } catch (err) {
        console.error("Failed to fetch pools:", err);
      }
    };

    if (sdk) {
      fetchPools();
    }
  }, [sdk]);

  if (isLoading) return <div className="loading">Loading pools...</div>;
  if (error)
    return <div className="error">Error loading pools: {error.message}</div>;

  return (
    <div className="pool-list">
      <h2>Available Pools</h2>
      {pools.length === 0 ? (
        <p>No pools found</p>
      ) : (
        <div className="pool-grid">
          {pools.map((poolAddress, index) => (
            <div
              key={index}
              className="pool-card"
              onClick={() => navigate(`/pool/${poolAddress}`)}
            >
              <h3>Pool {index + 1}</h3>
              <p className="pool-address">
                {poolAddress.substring(0, 10)}...
                {poolAddress.substring(poolAddress.length - 10)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
