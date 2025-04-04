import { useEffect, useState } from "react";
import { CetusClmmSDK } from "@cetusprotocol/cetus-sui-clmm-sdk";
import { initCetusSDK } from "../utils/cetusSDKSetup";

export const useCetusSdk = () => {
  const [sdk, setSdk] = useState<CetusClmmSDK | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const setupSdk = async () => {
      try {
        setIsLoading(true);
        const cetusSDK = initCetusSDK();
        await cetusSDK.refreshPools();
        setSdk(cetusSDK);
      } catch (err) {
        console.error("Failed to initialize Cetus SDK:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    setupSdk();
  }, []);

  return { sdk, isLoading, error };
};
