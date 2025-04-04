import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SuiProvider } from "./providers/SuiProvider";
import { Home } from "./pages/Home";
import { PoolDetail } from "./pages/PoolDetail";
import "./styles/global.scss";

function App() {
  return (
    <SuiProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pool/:poolAddress" element={<PoolDetail />} />
        </Routes>
      </Router>
    </SuiProvider>
  );
}

export default App;
