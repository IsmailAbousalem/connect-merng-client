import React from 'react';
// import ReactDOM from 'react-dom'; // OUTDATED
import { createRoot } from 'react-dom/client';
import App from './App';
import ApolloProvider from './ApolloProvider'; // Import the ApolloProvider
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ApolloProvider>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
