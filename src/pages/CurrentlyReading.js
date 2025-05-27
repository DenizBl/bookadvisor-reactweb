import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createUser } from '../services/userService';

const CurrentlyReading = () => {
  const { currentUser } = useAuth();
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setCurrentlyReading([]);
      setLoading(false);
      return;
    }

    const readingRef = collection(db, 'users', currentUser.uid, 'currentlyReading');
    const unsubscribe = onSnapshot(readingRef, (snapshot) => {
      setCurrentlyReading(snapshot.docs.map(doc => doc.data()));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleRemoveFromCurrentlyReading = async (bookId) => {
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'currentlyReading', bookId));
      toast.success('Kitap "Halen Okunan Kitaplar" listesinden kaldırıldı');
    } catch (error) {
      toast.error('Kitap kaldırılırken bir hata oluştu');
      console.error('Error removing from currently reading:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg shadow-lg px-4 py-2 mb-6" style={{background: '#b91c1c'}}>
          <h1 className="text-2xl font-bold text-white">
            Halen Okunan Kitaplar
            <span className="text-sm font-normal text-red-100 ml-2">
              {currentlyReading.length} kitap
            </span>
          </h1>
        </div>
        {currentlyReading.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Henüz okumaya başladığınız kitap yok.</p>
            <Link to="/" className="text-red-600 hover:text-red-700 mt-4 inline-block">
              Kitap Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentlyReading.map((book) => (
              <div key={book.id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-[250px] mx-auto">
                <Link to={`/book/${book.id}`} className="block">
                  <div className="aspect-[2/3] w-full overflow-hidden rounded-t-lg bg-gray-50">
                    <img 
                      src={book.thumbnail || 'https://via.placeholder.com/150x220.png?text=Kapak+Yok'} 
                      alt={book.title} 
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </Link>
                <div className="p-3">
                  <Link to={`/book/${book.id}`} className="block">
                    <h2 className="text-base font-semibold text-gray-800 mb-1 hover:text-red-600 transition-colors duration-300 line-clamp-2">
                      {book.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                    {book.authors?.join(', ') || 'Bilinmeyen Yazar'}
                  </p>
                  <button
                    onClick={() => handleRemoveFromCurrentlyReading(book.id)}
                    className="w-full bg-red-50 text-red-600 px-3 py-1.5 text-sm rounded-md hover:bg-red-100 transition-colors duration-300"
                  >
                    Okumayı Bitir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentlyReading;
