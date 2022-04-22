import Reset from "./Reset";
import Router from "./Router";
import {ReactQueryDevtools} from "react-query/devtools";

function App() {
  return (
    <>
    <Reset />
    <Router />
    <ReactQueryDevtools initialIsOpen={true}></ReactQueryDevtools>
    </>
  );
}

export default App;
