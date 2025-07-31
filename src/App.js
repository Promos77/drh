import React from 'react';
import GlobalStyle from './styles/GlobalStyle';
import Header from './components/layout/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PipelinePage from './pages/PipelinePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import ProtectedRoute from './ProtectedRoute';

// Un composant pour afficher le Header uniquement si l'utilisateur est authentifié
const AppHeader = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Header /> : null;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <GlobalStyle />
          <AppHeader />
          <main>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                {/* Les routes protégées sont des enfants de ProtectedRoute */}
                <Route path="/" element={<PipelinePage />} />
                <Route path="/search" element={<SearchPage />} />
              </Route>
            </Routes>
          </main>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
