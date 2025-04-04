import { useState, useEffect } from "react";
import { PoolList } from "../components/PoolList";
import { Header } from "../components/Header";
import { useCetusSdk } from "../hooks/useCetusSdk";
import "./Home.scss";

export const Home = () => {
  const { sdk, isLoading } = useCetusSdk();
  const [stats, setStats] = useState({
    totalPools: 0,
    totalVolume: 0,
    totalLiquidity: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchStats = async () => {
      if (!sdk) return;

      try {
        // In a real implementation, we would fetch actual stats from the SDK
        // For now, we'll use mock data
        const poolsData = await sdk.Pool.getPoolsWithPage(0, 100);

        setStats({
          totalPools: poolsData.poolAddresses?.length || 0,
          totalVolume: 5432789, // Mock data
          totalLiquidity: 8765432, // Mock data
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    if (sdk) {
      fetchStats();
    }
  }, [sdk]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="page home-page">
      <Header />
      <div className="container">
        <h1>Cetus Pools</h1>
        <p className="subtitle">
          Explore and manage liquidity positions across Cetus pools
        </p>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-value">{stats.totalPools}</div>
            <div className="stat-label">Total Pools</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatNumber(stats.totalVolume)}</div>
            <div className="stat-label">24h Volume</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {formatNumber(stats.totalLiquidity)}
            </div>
            <div className="stat-label">Total Liquidity</div>
          </div>
        </div>

        <div className="filters">
          <input
            type="text"
            className="search-input"
            placeholder="Search pools by token name or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort by</option>
            <option value="liquidity_high">Liquidity: High to Low</option>
            <option value="liquidity_low">Liquidity: Low to High</option>
            <option value="volume_high">Volume: High to Low</option>
            <option value="volume_low">Volume: Low to High</option>
          </select>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <PoolList searchQuery={searchQuery} sortBy={sortBy} />
        )}
      </div>
    </div>
  );
};
