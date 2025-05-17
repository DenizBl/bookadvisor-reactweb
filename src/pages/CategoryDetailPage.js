import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { googleBooksService } from '../services/googleBooksService';
// categoriesData'nın doğru yoldan import edildiğinden emin olun
// ve displayNameTR alanını içerdiğinden emin olun.
import { categoriesData } from '../contexts/categoriesData'; // Sizin belirttiğiniz yol
import Header from '../components/Header';

export default function CategoryDetailPage() {
  const { slug } = useParams(); // Bu, URL'den gelen İngilizce slug (örn: "Fiction")
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  // Başlangıçta slug'ı kullan, sonra Türkçe ismi bulup güncelle
  const [categoryDisplayName, setCategoryDisplayName] = useState(slug);

  useEffect(() => {
    // Slug'a karşılık gelen Türkçe kategori adını bul
    const currentCategoryObject = categoriesData.find(cat => cat.slug === slug);
    if (currentCategoryObject && currentCategoryObject.displayNameTR) {
      setCategoryDisplayName(currentCategoryObject.displayNameTR);
    } else {
      // Eğer categoriesData içinde bulunamazsa veya displayNameTR yoksa, slug'ı kullanmaya devam et
      // (veya daha genel bir başlık "Kategori Detayları" gibi)
      // Slug'ın ilk harfini büyük yapmak isteyebilirsiniz.
      setCategoryDisplayName(slug.charAt(0).toUpperCase() + slug.slice(1));
    }

    setLoading(true);
    // googleBooksService.getBooksByCategory çağrısı zaten 'tr' parametresini gönderiyor.
    // Bu, googleBooksService'in bu parametreyi işleyip API'ye langRestrict=tr
    // olarak göndermesini gerektirir.
    googleBooksService.getBooksByCategory(slug, 'tr')
      .then(fetchedBooks => {
        setBooks(fetchedBooks || []); // API boş dönerse veya items yoksa boş dizi
      })
      .catch(error => {
        console.error("Kitaplar getirilirken hata oluştu:", error);
        setBooks([]); // Hata durumunda kitapları boşalt
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]); // categoriesData statik bir import ise bağımlılık olarak eklenmesine gerek yok.

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg px-4 py-2 mb-6">
          <h1 className="text-2xl font-bold text-white">
            {categoryDisplayName} Kitapları
            <span className="text-sm font-normal text-red-100 ml-2">
              {books.length} kitap
            </span>
          </h1>
        </div>
        {loading ? (
          <div className="text-center py-10">Yükleniyor...</div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map(book => (
              <Link 
                key={book.id} 
                to={`/book/${book.id}`}
                className="bg-white p-4 rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] group flex flex-col"
              >
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x220.png?text=Kapak+Yok'}
                  alt={book.volumeInfo.title}
                  className="w-full h-64 object-contain mb-3 rounded group-hover:shadow-md transition-all duration-300"
                />
                <div className="flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                    {book.volumeInfo.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                    {book.volumeInfo.authors?.join(', ') || 'Bilinmeyen Yazar'}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-3 mt-auto">
                    {book.volumeInfo.description || 'Açıklama mevcut değil.'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">Bu kategoride Türkçe kitap bulunamadı veya bir hata oluştu.</div>
        )}
      </div>
    </div>
  );
}