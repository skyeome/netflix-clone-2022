import Reset from "./Reset";
import Router from "./Router";
import {ReactQueryDevtools} from "react-query/devtools";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "./atoms";

function App() {
  const isDark = useRecoilValue(isDarkAtom);
  return (
    <>
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Reset />
      <HelmetProvider>
        <Router/>
      </HelmetProvider>
      <ReactQueryDevtools initialIsOpen={true}></ReactQueryDevtools>
    </ThemeProvider>
    </>
  );
}

export default App;
