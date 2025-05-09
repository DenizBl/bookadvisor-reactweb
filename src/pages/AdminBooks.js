import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookForm from "../components/BookForm"
import BookList from "../components/BookList"

export default function AdminBooks() {
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  const handleAddBook = () => {
    setSelectedBook(null);
    setShowForm(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedBook(null);
  };

  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Kitap Yönetimi</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 mr-4"
              >
                Ana Sayfa
              </button>
              <button
                onClick={handleAddBook}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Yeni Kitap Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {showForm ? (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {selectedBook ? 'Kitabı Düzenle' : 'Yeni Kitap Ekle'}
            </h2>
            <BookForm book={selectedBook} onSuccess={handleFormSuccess} />
          </div>
        ) : (
          <BookList onEdit={handleEditBook} />
        )}
      </main>
    </div>
  );
} 