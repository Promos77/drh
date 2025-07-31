import React, { createContext, useState, useContext, useEffect } from 'react';

// Le mot de passe est stocké ici. Dans une application réelle, il viendrait des variables d'environnement.
const SECRET_PASSWORD = 'P@g43&ysDn8';

// 1. Création du contexte
const AuthContext = createContext(null);

// 2. Création du Provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Au chargement, on vérifie si l'utilisateur était déjà connecté
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Indique que le chargement est terminé
  }, []);

  // Fonction de connexion
  const login = (passwordAttempt) => {
    if (passwordAttempt === SECRET_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true; // Succès
    }
    return false; // Échec
  };

  // Fonction de déconnexion
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    isLoading, // Expose l'état de chargement
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Hook personnalisé pour utiliser le contexte plus facilement
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Correction de l'erreur de syntaxe ici
    throw new Error("useAuth doit être utilisé au sein d'un AuthProvider");
  }
  return context;
};
