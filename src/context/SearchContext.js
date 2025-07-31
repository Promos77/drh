import React, { createContext, useContext, useState, useEffect } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useState({
    query: '',
    filters: {}
  });

  useEffect(() => {
    // Charger les paramètres de recherche précédents depuis localStorage
    const savedParams = localStorage.getItem('lastSearchParams');
    if (savedParams) {
      setSearchParams(JSON.parse(savedParams));
    }
  }, []);

  const performSearch = async (params) => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error('Échec de la recherche');
      }
      
      const results = await response.json();
      setSearchResults(results);
      setSearchParams(params);
      
      // Sauvegarder les paramètres dans localStorage
      localStorage.setItem('lastSearchParams', JSON.stringify(params));
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      // Réinitialiser les résultats en cas d'erreur
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchParams({
      query: '',
      filters: {}
    });
    localStorage.removeItem('lastSearchParams');
  };

  return (
    <SearchContext.Provider value={{ searchResults, searchParams, performSearch, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
