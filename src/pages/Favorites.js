import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, onSnapshot, doc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Favorites = () => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState({});

  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    const favRef = collection(db, 'users', currentUser.uid, 'favorites');
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      setFavorites(snapshot.docs.map(doc => doc.data()));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const fetchCommentCounts = async () => {
      const counts = {};
      for (const book of favorites) {
        const commentsRef = collection(db, 'bookComments', book.id, 'comments');
        const q = query(commentsRef);
        const querySnapshot = await getDocs(q);
        counts[book.id] = querySnapshot.size;
      }
      setCommentCounts(counts);
    };

    if (favorites.length > 0) {
      fetchCommentCounts();
    }
  }, [favorites]);

  const handleRemoveFromFavorites = async (bookId) => {
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'favorites', bookId));
      toast.success('Kitap favorilerden kaldırıldı');
    } catch (error) {
      toast.error('Favorilerden kaldırılırken bir hata oluştu');
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg px-4 py-2 mb-6">
          <h1 className="text-2xl font-bold text-white">
            Favori Kitaplar
            <span className="text-sm font-normal text-red-100 ml-2">
              {favorites.length} kitap
            </span>
          </h1>
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Yükleniyor...</div>
        ) : favorites.length === 0 ? (
          <div className="text-center text-gray-500">Henüz favori kitap eklemediniz.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((book) => (
              <div key={book.id} className="flex flex-col">
                <div className="border border-gray-200 rounded-lg p-3 bg-[#f7e8e6] shadow-sm h-full flex flex-col">
                  <Link 
                    to={`/book/${book.id}`}
                    className="block transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex-1"
                  >
                    <div className="aspect-[2/3] w-32 mx-auto overflow-hidden rounded-md">
                      <img 
                        src={book.thumbnail || 'https://via.placeholder.com/150x200'} 
                        alt={book.title} 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
                      />
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-gray-800 line-clamp-2 hover:text-red-600 transition-colors duration-300">
                      {book.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-1">
                      {book.authors?.join(', ')}
                    </p>
                  </Link>
                  <button
                    onClick={() => handleRemoveFromFavorites(book.id)}
                    className="mt-3 w-full py-1.5 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-300 flex items-center justify-center gap-1.5 border-t border-gray-200 pt-2 text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Favorilerden Kaldır
                  </button>
                  <Link
                    to={`/book/${book.id}`}
                    className="mt-2 w-full py-1.5 px-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-1.5 text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {commentCounts[book.id] || 0} Yorum
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
