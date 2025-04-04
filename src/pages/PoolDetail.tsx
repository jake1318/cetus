import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useCetusSdk } from "../hooks/useCetusSdk";
import { useWallet } from "../hooks/useWallet";
import { AddLiquidityModal } from "../components/AddLiquidityModal";
import { RemoveLiquidityModal } from "../components/RemoveLiquidityModal";
import Chart from "react-apexcharts";
import "./PoolDetail.scss";

export const PoolDetail = () => {
  const { poolAddress } = useParams<{ poolAddress: string }>();
  const navigate = useNavigate();
  const { sdk, isLoading: sdkLoading } = useCetusSdk();
  const { account, getPositionsForPool } = useWallet();

  const [poolData, setPoolData] = useState<any>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddLiquidityOpen, setIsAddLiquidityOpen] = useState(false);
  const [isRemoveLiquidityOpen, setIsRemoveLiquidityOpen] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<
    string | undefined
  >(undefined);
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");
  const [priceData, setPriceData] = useState<any[]>([]);

  // Fetch pool details
  useEffect(() => {
    const fetchPoolDetails = async () => {
      if (!sdk || !poolAddress) return;

      try {
        setLoading(true);
        const pool = await sdk.Pool.getPool(poolAddress);
        setPoolData(pool);

        // Fetch mock price data for demonstration
        setPriceData(generateMockPriceData(timeframe));
      } catch (err) {
        console.error("Failed to fetch pool details:", err);
        setError("Failed to load pool details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (sdk && !sdkLoading) {
      fetchPoolDetails();
    }
  }, [sdk, sdkLoading, poolAddress, timeframe]);

  // Fetch user positions
  useEffect(() => {
    const fetchPositions = async () => {
      if (!sdk || !account || !poolAddress) return;

      try {
        setPositionsLoading(true);
        const userPositions = await getPositionsForPool(poolAddress, sdk);
        setPositions(userPositions);
      } catch (err) {
        console.error("Failed to fetch positions:", err);
      } finally {
        setPositionsLoading(false);
      }
    };

    if (sdk && account) {
      fetchPositions();
    } else {
      setPositions([]);
    }
  }, [sdk, account, poolAddress, getPositionsForPool]);

  const generateMockPriceData = (timeframe: "24h" | "7d" | "30d") => {
    const now = new Date();
    const data = [];
    let points = 24;
    let interval = 60 * 60 * 1000; // 1 hour in ms

    if (timeframe === "7d") {
      points = 7;
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else if (timeframe === "30d") {
      points = 30;
      interval = 24 * 60 * 60 * 1000; // 1 day
    }

    let price = 1.0;
    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * interval);
      // Random price movement between -5% and +5%
      const change = Math.random() * 0.1 - 0.05;
      price = price * (1 + change);

      data.push({
        x: time.getTime(),
        y: price.toFixed(6),
      });
    }

    return data;
  };

  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#94a3b8",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#94a3b8",
        },
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: "rgba(255, 255, 255, 0.1)",
      row: {
        colors: ["transparent"],
      },
    },
    theme: {
      mode: "dark",
    },
  };

  const handleOpenRemoveLiquidity = (positionId?: string) => {
    setSelectedPositionId(positionId);
    setIsRemoveLiquidityOpen(true);
  };

  if (sdkLoading || loading) {
    return (
      <div className="page">
        <Header />
        <div className="container">
          <div className="loading">Loading pool details...</div>
        </div>
      </div>
    );
  }

  if (error || !poolData) {
    return (
      <div className="page">
        <Header />
        <div className="container">
          <div className="error">{error || "Pool not found"}</div>
          <button className="back-button" onClick={() => navigate("/")}>
            Back to Pools
          </button>
        </div>
      </div>
    );
  }

  const tokenASymbol = poolData.coinTypeA?.split("::").pop() || "Token A";
  const tokenBSymbol = poolData.coinTypeB?.split("::").pop() || "Token B";

  return (
    <div className="page pool-detail-page">
      <Header />
      <div className="container">
        <div className="page-header">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back to Pools
          </button>
          <h1>
            {tokenASymbol} / {tokenBSymbol} Pool
          </h1>
        </div>

        {/* Price Chart Section */}
        <div className="price-chart-section">
          <div className="chart-header">
            <h2>Price History</h2>
            <div className="timeframe-selector">
              <button
                className={timeframe === "24h" ? "active" : ""}
                onClick={() => setTimeframe("24h")}
              >
                24h
              </button>
              <button
                className={timeframe === "7d" ? "active" : ""}
                onClick={() => setTimeframe("7d")}
              >
                7d
              </button>
              <button
                className={timeframe === "30d" ? "active" : ""}
                onClick={() => setTimeframe("30d")}
              >
                30d
              </button>
            </div>
          </div>

          <div className="chart-container">
            <Chart
              options={chartOptions as any}
              series={[
                {
                  name: `${tokenASymbol}/${tokenBSymbol}`,
                  data: priceData,
                },
              ]}
              type="area"
              height={350}
            />
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="add-liquidity-btn"
            onClick={() => setIsAddLiquidityOpen(true)}
          >
            Add Liquidity
          </button>
          <button
            className="remove-liquidity-btn"
            onClick={() => setIsRemoveLiquidityOpen(true)}
            disabled={positions.length === 0}
          >
            Remove Liquidity
          </button>
        </div>

        {/* Pool Info Section */}
        <div className="info-grid">
          <div className="info-card">
            <h2>Pool Details</h2>
            <div className="info-item">
              <span className="label">Pool Address</span>
              <span className="value address">{poolAddress}</span>
            </div>
            <div className="info-item">
              <span className="label">Token A</span>
              <span className="value token-value">{tokenASymbol}</span>
            </div>
            <div className="info-item">
              <span className="label">Token B</span>
              <span className="value token-value">{tokenBSymbol}</span>
            </div>
            <div className="info-item">
              <span className="label">Fee Rate</span>
              <span className="value">
                {(Number(poolData.fee_rate) / 1000000).toFixed(4)}%
              </span>
            </div>
            <div className="info-item">
              <span className="label">Tick Spacing</span>
              <span className="value">{poolData.tickSpacing}</span>
            </div>
            <div className="info-item">
              <span className="label">Current Price</span>
              <span className="value">
                {priceData.length > 0
                  ? priceData[priceData.length - 1].y
                  : "N/A"}{" "}
                {tokenBSymbol}/{tokenASymbol}
              </span>
            </div>
          </div>

          {/* Your Positions Section */}
          <div className="info-card positions-card">
            <h2>Your Positions</h2>
            {!account ? (
              <div className="connect-wallet-notice">
                Connect your wallet to view your positions.
              </div>
            ) : positionsLoading ? (
              <div className="loading">Loading positions...</div>
            ) : positions.length === 0 ? (
              <div className="no-positions">
                You don't have any positions in this pool.
              </div>
            ) : (
              <div className="positions-list">
                {positions.map((position, index) => (
                  <div key={index} className="position-item">
                    <div className="position-header">
                      <span className="position-title">
                        Position #{position.posId.substring(0, 8)}...
                      </span>
                      <button
                        className="remove-btn"
                        onClick={() =>
                          handleOpenRemoveLiquidity(position.posId)
                        }
                      >
                        Remove
                      </button>
                    </div>
                    <div className="position-details">
                      <div className="position-detail-item">
                        <span className="label">Liquidity</span>
                        <span className="value">{position.liquidity}</span>
                      </div>
                      <div className="position-detail-item">
                        <span className="label">{tokenASymbol}</span>
                        <span className="value">
                          {position.tokenAAmount || "N/A"}
                        </span>
                      </div>
                      <div className="position-detail-item">
                        <span className="label">{tokenBSymbol}</span>
                        <span className="value">
                          {position.tokenBAmount || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddLiquidityOpen && (
        <AddLiquidityModal
          isOpen={isAddLiquidityOpen}
          onClose={() => setIsAddLiquidityOpen(false)}
          poolAddress={poolAddress || ""}
          tokenASymbol={tokenASymbol}
          tokenBSymbol={tokenBSymbol}
        />
      )}

      {isRemoveLiquidityOpen && (
        <RemoveLiquidityModal
          isOpen={isRemoveLiquidityOpen}
          onClose={() => setIsRemoveLiquidityOpen(false)}
          poolAddress={poolAddress || ""}
          positionId={selectedPositionId}
        />
      )}
    </div>
  );
};
