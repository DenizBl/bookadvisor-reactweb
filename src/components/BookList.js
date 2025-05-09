import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const booksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(booksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (bookId) => {
    if (window.confirm('Bu kitabı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'books', bookId));
        toast.success('Kitap başarıyla silindi!');
      } catch (error) {
        toast.error('Kitap silinirken bir hata oluştu: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <div key={book.id} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
            <p className="mt-1 text-sm text-gray-500">Yazar: {book.author}</p>
            <p className="mt-1 text-sm text-gray-500">ISBN: {book.isbn}</p>
            <p className="mt-1 text-sm text-gray-500">
              Hedef Kitle: {
                {
                  'children': 'Çocuklar',
                  'young-adult': 'Genç Yetişkinler',
                  'adult': 'Yetişkinler'
                }[book.targetAudience]
              }
            </p>
            <p className="mt-2 text-sm text-gray-700">{book.description}</p>
            
            {userRole === 'admin' && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleDelete(book.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sil
                </button>
                <button
                  onClick={() => {/* TODO: Implement edit functionality */}}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Düzenle
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 