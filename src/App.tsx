import Reset from "./Reset";
import Router from "./Router";
import {ReactQueryDevtools} from "react-query/devtools";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <>
    <Reset />
    <HelmetProvider>
      <Router />
    </HelmetProvider>
    <ReactQueryDevtools initialIsOpen={true}></ReactQueryDevtools>
    </>
  );
}

export default App;
