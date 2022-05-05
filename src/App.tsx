import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {ReactQueryDevtools} from "react-query/devtools";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <>
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:movieId" element={<Home />} />
        <Route path="/tv" element={<Tv />} />
        <Route path="/tv/:movieId" element={<Tv />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/:movieId" element={<Search />} />
      </Routes>
    </Router>
    <ReactQueryDevtools initialIsOpen={true}></ReactQueryDevtools>
    </>
  );
}

export default App;
