import React from 'react';
import Header from '../components/Header';

const ReadBooks = () => {
  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg px-4 py-2 mb-6">
          <h1 className="text-2xl font-bold text-white">
            Okunan Kitaplar
            <span className="text-sm font-normal text-red-100 ml-2">
              0 kitap
            </span>
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Okunan kitapları burada listeleyin */}
          <div className="border border-gray-200 rounded-lg p-4">
            <img src="book-image.jpg" alt="Book" className="w-full h-48 object-cover rounded-md" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">Kitap Adı</h2>
            <p className="text-gray-600">Yazar Adı</p>
          </div>
          {/* Diğer kitaplar */}
        </div>
      </div>
    </div>
  );
};

export default ReadBooks;
