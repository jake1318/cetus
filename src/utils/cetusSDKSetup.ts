import { CetusClmmSDK } from "@cetusprotocol/cetus-sui-clmm-sdk";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

// Network can be "mainnet", "testnet", or "devnet"
const NETWORK = "mainnet";
const suiClient = new SuiClient({ url: getFullnodeUrl(NETWORK) });

// Package IDs for Cetus on mainnet
const CETUS_CONFIG = {
  mainnet: {
    clmmIntegrate:
      "0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb",
    clmm: "0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb",
    poolAddress:
      "0x9e3dab13212b27f5434416939db5dec6a319d15b89a84ca5ac30ae52e4d9bd90",
    launchpadPool:
      "0xf5ff7d5ab6376e2899a5dbe5a3a573a4c7c2edaf578b9b64317b2651fd17b7a1",
  },
};

// Initialize the SDK
export const initCetusSDK = () => {
  return new CetusClmmSDK({
    network: NETWORK,
    fullNode: getFullnodeUrl(NETWORK),
    faucet: "",
    simulationAccount: {
      address:
        "0x856e2b9a5fa82fd1b031d1ff6863864dbac7995d127f6c4387ab1c1640f77279",
    },
    clmm: {
      clmmIntegrate: CETUS_CONFIG.mainnet.clmmIntegrate,
      clmm: CETUS_CONFIG.mainnet.clmm,
      poolAddress: CETUS_CONFIG.mainnet.poolAddress,
      launchpadPool: CETUS_CONFIG.mainnet.launchpadPool,
    },
  });
};

export const getSuiClient = () => suiClient;
