import React, { createContext, useContext, useState } from 'react';
import { googleBooksService } from '../services/googleBooksService';

const SearchContext = createContext();

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchBooks = async (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await googleBooksService.searchBooks(term);
      setSearchResults(results);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, searchResults, isSearching, searchBooks, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
} 