import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import wasm from "chickens-wasm";

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Important:
// A dependency graph that contains any wasm must all be imported
// asynchronously. This code here does the single async import, so
// that no one else needs to worry about it again.
wasm()
  .catch(console.error)
  .then(() => {
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
          </QueryClientProvider>
      </React.StrictMode>
    );
    
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
