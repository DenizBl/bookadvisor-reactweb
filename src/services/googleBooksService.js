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

    

    getBooksByCategory: async (category, lang = 'tr') => { // lang parametresi eklendi, varsayılan 'tr'
        try {
            // `category` subject olarak aranırken tırnak içinde olması daha doğru sonuçlar verebilir.
            // Örn: "Juvenile Fiction" gibi boşluk içeren kategoriler için.
            // Ancak Google API'si subject:Fiction şeklinde de çalışır.
            // Güvenlik için category'yi de encodeURIComponent ile sarmalayalım.
            const query = `subject:${encodeURIComponent(category)}`;
            const response = await fetch(`${BASE_URL}?q=${query}&langRestrict=${lang}&maxResults=20&key=${API_KEY}`); // maxResults eklendi (opsiyonel)
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error(`Error fetching books by category "${category}" with lang "${lang}":`, error);
            return []; // Hata durumunda boş dizi döndürmek daha kullanıcı dostu olabilir
        }
    },

    // Get book details by ID
    getBookById: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/${id}?key=${API_KEY}`);
            if (!response.ok) {
                throw new Error('Kitap detayları alınamadı');
            }
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