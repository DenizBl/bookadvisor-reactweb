import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookForm from '../../components/BookForm';
import Header from '../../components/Header';

export default function AdminAddBook() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSuccess = () => {
    // Kitap başarıyla eklendiğinde kitap yönetimi sayfasına yönlendir
    navigate('/admin/books');
  };

  const handleCancel = () => {
    // İptal edildiğinde admin ana sayfasına geri dön
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Sayfa Başlığı */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Yeni Kitap Ekle</h1>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={() => navigate('/admin/books')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Kitap Listesi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kitap Ekleme Formu */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Kitap Bilgileri</h2>
            <p className="text-sm text-gray-600">
              Aşağıdaki formu doldurarak yeni bir kitap ekleyebilirsiniz. Tüm alanların doğru şekilde doldurulduğundan emin olun.
            </p>
          </div>
          
          <BookForm 
            book={null} 
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </div>

        {/* Yardım Bölümü */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">💡 İpuçları</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Kitap başlığını net ve doğru şekilde yazın</li>
            <li>• Yazar adını tam olarak girin</li>
            <li>• Uygun kategori seçin</li>
            <li>• Kitap kapağı için kaliteli bir görsel URL'i kullanın</li>
            <li>• Açıklama kısmını detaylı ama öz tutun</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 