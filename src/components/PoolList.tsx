import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCetusSdk } from "../hooks/useCetusSdk";
import "./PoolList.scss";

interface PoolListProps {
  searchQuery?: string;
  sortBy?: string;
}

export const PoolList = ({
  searchQuery = "",
  sortBy = "default",
}: PoolListProps) => {
  const { sdk, isLoading, error } = useCetusSdk();
  const [pools, setPools] = useState<any[]>([]);
  const [poolDetails, setPoolDetails] = useState<any[]>([]);
  const [filteredPools, setFilteredPools] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPools = async () => {
      if (!sdk) return;

      try {
        const poolsData = await sdk.Pool.getPoolsWithPage(0, 100);
        setPools(poolsData.poolAddresses || []);

        // Fetch details for each pool
        const details = await Promise.all(
          poolsData.poolAddresses.slice(0, 10).map(async (address) => {
            try {
              return await sdk.Pool.getPool(address);
            } catch (e) {
              console.error(`Failed to get pool ${address}:`, e);
              return null;
            }
          })
        );

        const validDetails = details.filter(Boolean);
        setPoolDetails(validDetails);
        setFilteredPools(validDetails);
      } catch (err) {
        console.error("Failed to fetch pools:", err);
      }
    };

    if (sdk) {
      fetchPools();
    }
  }, [sdk]);

  useEffect(() => {
    if (!poolDetails.length) return;

    // Filter pools based on search query
    let filtered = poolDetails;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = poolDetails.filter((pool) => {
        const tokenA = pool.coinTypeA?.toLowerCase() || "";
        const tokenB = pool.coinTypeB?.toLowerCase() || "";
        const address = pool.poolAddress?.toLowerCase() || "";

        return (
          tokenA.includes(query) ||
          tokenB.includes(query) ||
          address.includes(query)
        );
      });
    }

    // Sort pools based on sortBy
    if (sortBy !== "default") {
      filtered = [...filtered].sort((a, b) => {
        // In a real implementation, these would be actual pool metrics
        const liquidityA = Math.random() * 1000000; // Mock data
        const liquidityB = Math.random() * 1000000; // Mock data
        const volumeA = Math.random() * 500000; // Mock data
        const volumeB = Math.random() * 500000; // Mock data

        switch (sortBy) {
          case "liquidity_high":
            return liquidityB - liquidityA;
          case "liquidity_low":
            return liquidityA - liquidityB;
          case "volume_high":
            return volumeB - volumeA;
          case "volume_low":
            return volumeA - volumeB;
          default:
            return 0;
        }
      });
    }

    setFilteredPools(filtered);
  }, [searchQuery, sortBy, poolDetails]);

  if (isLoading) return <div className="loading">Loading pools...</div>;
  if (error)
    return <div className="error">Error loading pools: {error.message}</div>;

  return (
    <div className="pool-list">
      <h2>Available Pools</h2>
      {filteredPools.length === 0 ? (
        <p className="no-pools">No pools found matching your criteria</p>
      ) : (
        <div className="pool-grid">
          {filteredPools.map((pool, index) => (
            <div
              key={index}
              className="pool-card"
              onClick={() => navigate(`/pool/${pool.poolAddress}`)}
            >
              <h3>
                {pool.name ||
                  `${pool.coinTypeA?.split("::").pop() || "Token A"} / ${
                    pool.coinTypeB?.split("::").pop() || "Token B"
                  }`}
              </h3>
              <div className="pool-tokens">
                <span>
                  {pool.coinTypeA?.split("::").pop() || "Token A"} /{" "}
                  {pool.coinTypeB?.split("::").pop() || "Token B"}
                </span>
              </div>
              <p className="pool-address">
                {pool.poolAddress?.substring(0, 10)}...
                {pool.poolAddress?.substring(pool.poolAddress.length - 10)}
              </p>
              <div className="pool-stats">
                <div className="stat-item">
                  <div className="stat-label">Fee</div>
                  <div className="stat-value">
                    {(Number(pool.fee_rate || 0) / 10000).toFixed(2)}%
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Tick Spacing</div>
                  <div className="stat-value">{pool.tickSpacing || "N/A"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
