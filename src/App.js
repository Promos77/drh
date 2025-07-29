import React from 'react';
import GlobalStyle from './styles/GlobalStyle';
import Header from './components/layout/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Pipeline from './components/pipeline/Pipeline';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Pipeline />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
