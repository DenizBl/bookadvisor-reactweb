import React from 'react';
import { useParams } from 'react-router-dom';

export default function CategoryDetailPage() {
  const { slug } = useParams();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 capitalize">
        {slug.replace(/-/g, ' ')} Kategorisi
      </h1>
      
      <p className="text-gray-600 mb-4">
        Burada <strong>{slug.replace(/-/g, ' ')}</strong> kategorisine ait kitaplar listelenecek.
      </p>

      {/* Örnek bir liste */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Buraya dinamik kitap kartları gelebilir */}
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
          <div className="h-40 bg-gray-200 rounded mb-2"></div>
          <h2 className="text-lg font-semibold">Kitap Adı 1</h2>
          <p className="text-sm text-gray-500">Yazar Adı</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
          <div className="h-40 bg-gray-200 rounded mb-2"></div>
          <h2 className="text-lg font-semibold">Kitap Adı 2</h2>
          <p className="text-sm text-gray-500">Yazar Adı</p>
        </div>
        {/* ... Diğer kartlar */}
      </div>
    </div>
  );
}
