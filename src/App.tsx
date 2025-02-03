import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Swap from "./pages/swap";
import "./App.css";

// Network configuration (update if needed)
const networkConfig = {
  testnet: { url: "https://fullnode.testnet.sui.io" },
  mainnet: { url: "https://fullnode.mainnet.sui.io" },
};

// Create a QueryClient instance for React Query.
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <Router>
            <Routes>
              <Route path="/" element={<Swap />} />
            </Routes>
          </Router>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default App;
