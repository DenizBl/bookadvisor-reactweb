import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { googleBooksService } from '../../services/googleBooksService';
import { toast } from 'react-hot-toast';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, getDoc, query } from 'firebase/firestore';

const AdminBookSearch = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(null, query);
    } else {
      // Arama yapılmamışsa admin'in eklediği kitapları getir
      fetchAdminBooks();
    }
  }, [searchParams]);

  const fetchAdminBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const booksRef = collection(db, 'books');
      const booksSnapshot = await getDocs(booksRef);
      const adminBooks = booksSnapshot.docs.map((doc) => ({
        id: doc.id,
        volumeInfo: {
          ...doc.data(),
          imageLinks: {
            thumbnail:
              doc.data().imageUrl ||
              'https://via.placeholder.com/150x220.png?text=Kapak+Yok',
          },
        },
      }));

      setBooks(adminBooks);
    } catch (err) {
      console.error('Error fetching admin books:', err);
      setError('Kitaplar yüklenirken bir hata oluştu.');
      toast.error('Kitaplar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      const comments = {};
      const likes = {};

      for (const book of books) {
        // Fetch comments count
        const commentsRef = collection(db, 'bookComments', book.id, 'comments');
        const commentsQuery = query(commentsRef);
        const commentsSnapshot = await getDocs(commentsQuery);
        comments[book.id] = commentsSnapshot.size;

        // Fetch likes count
        const likesRef = doc(db, 'bookLikes', book.id);
        const likesDoc = await getDoc(likesRef);
        likes[book.id] = likesDoc.exists() ? likesDoc.data().count : 0;
      }

      setCommentCounts(comments);
      setLikeCounts(likes);
    };

    if (books.length > 0) {
      fetchCounts();
    }
  }, [books]);

  const handleSearch = async (e, query = searchQuery) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      fetchAdminBooks();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await googleBooksService.searchBooks(query);
      setBooks(results);
    } catch (err) {
      console.error('Error searching books:', err);
      setError('Kitaplar aranırken bir hata oluştu.');
      toast.error('Kitaplar aranırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kitap Arama</h1>

      {/* Arama Formu */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ISBN ile arama yapın..."
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Ara
          </button>
        </div>
      </form>

      {/* Yükleniyor Durumu */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}

      {/* Hata Mesajı */}
      {error && <div className="text-red-600 text-center py-4">{error}</div>}

      {/* Kitap Listesi */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <img
                  src={
                    book.volumeInfo.imageLinks?.thumbnail ||
                    'https://via.placeholder.com/150x220.png?text=Kapak+Yok'
                  }
                  alt={book.volumeInfo.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 rounded-bl-lg">
                  {book.volumeInfo.publishedDate?.split('-')[0] || 'N/A'}
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  {book.volumeInfo.title}
                </h2>
                {book.volumeInfo.authors && (
                  <p className="text-gray-600 mb-2 line-clamp-1">
                    {book.volumeInfo.authors.join(', ')}
                  </p>
                )}
                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    {commentCounts[book.id] || 0}
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {likeCounts[book.id] || 0}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() =>
                      window.open(book.volumeInfo.infoLink, '_blank')
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Detaylar
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = `/book/${book.id}`;
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Kitaba Git
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sonuç Bulunamadı */}
      {!loading && !error && books.length === 0 && searchQuery && (
        <div className="text-center text-gray-500 py-8">
          Arama kriterlerinize uygun kitap bulunamadı.
        </div>
      )}
    </div>
  );
};

export default AdminBookSearch;