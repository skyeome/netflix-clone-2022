import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import App from './App';
import Reset from './Reset';
import { QueryClient, QueryClientProvider } from "react-query";
import { theme } from './theme';

const client = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <RecoilRoot>
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <Reset />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </RecoilRoot>
);