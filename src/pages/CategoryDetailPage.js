


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { googleBooksService } from '../services/googleBooksService';
// categoriesData'nın doğru yoldan import edildiğinden emin olun
// ve displayNameTR alanını içerdiğinden emin olun.
import { categoriesData } from '../contexts/categoriesData'; // Sizin belirttiğiniz yol

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
    <div className="container mx-auto p-4">
      {/* Kategori adını Türkçe olarak ve "Kitapları" ekiyle göster */}
      <h1 className="text-3xl font-bold mb-6">{categoryDisplayName} Kitapları</h1>
      {loading ? (
        <div className="text-center py-10">Yükleniyor...</div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <div key={book.id} className="bg-white p-4 rounded-lg shadow flex flex-col">
              <img
                src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x220.png?text=Kapak+Yok'} // Biraz daha dikey bir placeholder
                alt={book.volumeInfo.title}
                className="w-full h-64 object-contain mb-3 rounded" // Yüksekliği biraz ayarladım, object-contain önemli
              />
              <div className="flex flex-col flex-grow"> {/* İçeriğin dikeyde büyümesini sağlar */}
                <h3 className="text-lg font-semibold text-red-600 mb-1 line-clamp-2">
                  {book.volumeInfo.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                  {book.volumeInfo.authors?.join(', ') || 'Bilinmeyen Yazar'}
                </p>
                {/* Açıklamanın kartın en altında kalması için mt-auto */}
                <p className="text-xs text-gray-600 line-clamp-3 mt-auto">
                  {book.volumeInfo.description || 'Açıklama mevcut değil.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">Bu kategoride Türkçe kitap bulunamadı veya bir hata oluştu.</div>
      )}
    </div>
  );
}