import { useCurrentAccount, ConnectButton } from "@suiet/wallet-kit";
import "./Header.scss";

export const Header = () => {
  const account = useCurrentAccount();

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">Cetus Pools App</div>
        <div className="wallet">
          {account ? (
            <div className="account-info">
              <span className="address">
                {account.address.substring(0, 6)}...
                {account.address.substring(account.address.length - 4)}
              </span>
            </div>
          ) : (
            <ConnectButton>Connect Wallet</ConnectButton>
          )}
        </div>
      </div>
    </header>
  );
};
