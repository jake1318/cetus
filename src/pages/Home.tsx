import { PoolList } from "../components/PoolList";
import { Header } from "../components/Header";

export const Home = () => {
  return (
    <div className="page home-page">
      <Header />
      <div className="container">
        <h1>Cetus Pools</h1>
        <PoolList />
      </div>
    </div>
  );
};
