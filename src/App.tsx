import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Layout from './components/common/Layout';
import Home from './components/pages/Home';
// import Pokemon from './pages/Pokemon';
// import Teams from './pages/Teams';
// import TeamDetails from './pages/TeamDetails';

const App: React.FC = () => {
  return (
    <Box minHeight="100vh" bg="gray.50">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/pokemon" element={<Pokemon />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetails />} /> */}
        </Routes>
      </Layout>
    </Box>
  );
};

export default App;