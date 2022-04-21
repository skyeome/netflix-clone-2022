import { BrowserRouter, Route, Routes } from "react-router-dom";
import Coin from "./routes/Coin";
import Coins from "./routes/Coins";

function Router(){
  return <BrowserRouter>
    <Routes>
      <Route path="/:id" element={<Coin/>} />
      <Route path="/" element={<Coins />} />
    </Routes>
  </BrowserRouter>
}
export default Router;