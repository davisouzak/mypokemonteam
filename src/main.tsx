import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { TeamProvider } from './components/context/TeamContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <TeamProvider>
          <App />
        </TeamProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
)