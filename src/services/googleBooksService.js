const API_KEY = 'AIzaSyADs3COfx8CSFizkqQjYdpPQ6_eTc9LaO0';
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export const googleBooksService = {
    // Search books by term
    searchBooks: async (searchTerm) => {
        try {
            const response = await fetch(`${BASE_URL}?q=${searchTerm}&key=${API_KEY}`);
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('Error searching books:', error);
            throw error;
        }
    },

    // Get books by category
    getBooksByCategory: async (category) => {
        try {
            const response = await fetch(`${BASE_URL}?q=subject:${category}&key=${API_KEY}`);
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('Error fetching books by category:', error);
            throw error;
        }
    },

    // Get book details by ID
    getBookById: async (bookId) => {
        try {
            const response = await fetch(`${BASE_URL}/${bookId}?key=${API_KEY}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching book details:', error);
            throw error;
        }
    },

    // Get books by author
    getBooksByAuthor: async (author) => {
        try {
            const response = await fetch(`${BASE_URL}?q=inauthor:${author}&key=${API_KEY}`);
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('Error fetching books by author:', error);
            throw error;
        }
    }
}; 