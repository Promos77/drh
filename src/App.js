import React from 'react';
import GlobalStyle from './styles/GlobalStyle';
import Header from './components/layout/Header';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Pipeline from './components/pipeline/Pipeline';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <GlobalStyle />
          <Header />
          <main>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Pipeline />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
