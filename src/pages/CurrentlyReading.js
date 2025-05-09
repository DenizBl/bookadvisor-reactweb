import React from 'react';
import Header from '../components/Header';

const CurrentlyReading = () => {
  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Halen Okunan Kitaplar</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Halen okunan kitapları burada listeleyin */}
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

export default CurrentlyReading;
