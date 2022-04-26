import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import App from './App';
import Reset from './Reset';
import { darkTheme } from './theme';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider theme={darkTheme}>
        <Reset />
        <App />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>
);