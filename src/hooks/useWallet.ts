import {
  useCurrentAccount,
  useWallet as useSuietWallet,
} from "@suiet/wallet-kit";
import { useEffect, useState } from "react";
import { getSuiProvider } from "../utils/cetusSDKSetup";

export const useWallet = () => {
  const account = useCurrentAccount();
  const wallet = useSuietWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const suiProvider = getSuiProvider();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!account) {
        setBalance(null);
        return;
      }

      try {
        setLoading(true);
        const balanceResponse = await suiProvider.getBalance({
          owner: account.address,
        });

        setBalance(balanceResponse.totalBalance);
        setError(null);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch balance")
        );
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [account, suiProvider]);

  const disconnect = () => {
    try {
      wallet.disconnect();
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  const getCoins = async (type: string = "0x2::sui::SUI") => {
    if (!account) return [];

    try {
      const coins = await suiProvider.getCoins({
        owner: account.address,
        coinType: type,
      });
      return coins.data || [];
    } catch (err) {
      console.error(`Error fetching coins of type ${type}:`, err);
      return [];
    }
  };

  // Get user's positions in a specific pool
  const getPositionsForPool = async (poolAddress: string, sdk: any) => {
    if (!account || !sdk) return [];

    try {
      // This is a simplified example - in a real app, you'd use the SDK
      // to fetch positions for the current address in the specific pool
      const positions = await sdk.Position.getPositionList({
        address: account.address,
        pool: poolAddress,
      });
      return positions || [];
    } catch (err) {
      console.error("Error fetching positions:", err);
      return [];
    }
  };

  return {
    account,
    connected: !!account,
    balance,
    loading,
    error,
    disconnect,
    getCoins,
    getPositionsForPool,
  };
};
