import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

const Favorites = () => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Favori Kitaplar</h1>
        {loading ? (
          <div className="text-center text-gray-500">Yükleniyor...</div>
        ) : favorites.length === 0 ? (
          <div className="text-center text-gray-500">Henüz favori kitap eklemediniz.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((book) => (
              <div key={book.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <img src={book.thumbnail || 'https://via.placeholder.com/150x200'} alt={book.title} className="w-full h-48 object-cover rounded-md" />
                <h2 className="mt-4 text-xl font-semibold text-gray-800 line-clamp-2">{book.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-1">{book.authors?.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
