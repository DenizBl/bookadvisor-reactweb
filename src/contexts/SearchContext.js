import React, { createContext, useContext, useState } from 'react';
import { googleBooksService } from '../services/googleBooksService';
import { db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchAdminBooks = async (term) => {
    try {
      const booksRef = collection(db, 'books');
      const booksSnapshot = await getDocs(booksRef);
      const adminBooks = [];
      
      booksSnapshot.forEach((doc) => {
        const bookData = doc.data();
        // Search in title, author, or description
        const searchableText = `${bookData.title || ''} ${bookData.author || ''} ${bookData.description || ''}`.toLowerCase();
        
        if (searchableText.includes(term.toLowerCase())) {
          adminBooks.push({
            id: doc.id,
            volumeInfo: {
              title: bookData.title || 'Untitled',
              authors: bookData.author ? [bookData.author] : ['Unknown Author'],
              description: bookData.description || 'No description available',
              imageLinks: {
                thumbnail: bookData.imageUrl || bookData.thumbnail || '/api/placeholder/128/192'
              },
              publishedDate: bookData.publishedDate || new Date().getFullYear().toString(),
              categories: bookData.targetAudience ? [bookData.targetAudience] : ['Fiction'],
              industryIdentifiers: bookData.isbn ? [{ type: 'ISBN', identifier: bookData.isbn }] : []
            },
            isAdminBook: true // Flag to identify admin books
          });
        }
      });
      
      return adminBooks;
    } catch (error) {
      console.error('Error searching admin books:', error);
      return [];
    }
  };

  const searchBooks = async (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      // Search both admin books and Google Books in parallel
      const [adminResults, googleResults] = await Promise.all([
        searchAdminBooks(term),
        googleBooksService.searchBooks(term)
      ]);
      
      // Combine results with admin books first
      const combinedResults = [
        ...adminResults,
        ...googleResults.slice(0, 50 - adminResults.length) // Limit total results
      ];
      
      setSearchResults(combinedResults);
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
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      searchResults,
      setSearchResults,
      isSearching,
      setIsSearching,
      searchBooks,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 