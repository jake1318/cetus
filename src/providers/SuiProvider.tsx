import { WalletProvider } from "@suiet/wallet-kit";
import { ReactNode } from "react";
import "@suiet/wallet-kit/style.css";

interface SuiProviderProps {
  children: ReactNode;
}

export function SuiProvider({ children }: SuiProviderProps) {
  return <WalletProvider>{children}</WalletProvider>;
}
