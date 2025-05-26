import React, { useState } from 'react';
import axios from 'axios';
import { googleBooksService } from '../services/googleBooksService';
import { Link } from 'react-router-dom';
import Header from './Header';

const AIBookRecommendation = () => {
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  const fetchSearchQueryFromGemini = async (userInput) => {
    try {
      // Doğrudan fetch API kullanarak deneyelim
      const response = await fetch(
        'https://us-central1-bookadvisor-40fcb.cloudfunctions.net/getGeminiSearchTerm',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Convert the following Turkish text into a relevant English book search term. Respond with only the search term, no additional text or explanation: "${userInput}"`
              }]
            }]
          }),
          mode: 'cors',
          credentials: 'omit'
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API yanıtı:', data);

      if (!data || !data.candidates || !data.candidates[0]) {
        throw new Error('API yanıtı beklenen formatta değil');
      }

      return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
      console.error('API Hatası Detayları:', error);

      // Basit bir fallback mekanizması
      const fallbackTerms = {
        'mutlu': 'happy feel good books',
        'üzgün': 'motivational self help books',
        'heyecanlı': 'thriller adventure books',
        'romantik': 'romance love story books',
        'macera': 'adventure action books',
        'bilim': 'science popular science books',
        'tarih': 'history historical books'
      };

      // Türkçe metni küçük harfe çevir ve boşlukları temizle
      const cleanInput = userInput.toLowerCase().trim();
      
      // Fallback terimleri kontrol et
      for (const [key, value] of Object.entries(fallbackTerms)) {
        if (cleanInput.includes(key)) {
          console.log('Fallback terim kullanılıyor:', value);
          return value;
        }
      }

      // Eğer fallback terim bulunamazsa, basit bir İngilizce çeviri dene
      const simpleTranslation = cleanInput
        .replace(/mutlu/g, 'happy')
        .replace(/üzgün/g, 'sad')
        .replace(/heyecanlı/g, 'exciting')
        .replace(/romantik/g, 'romantic')
        .replace(/macera/g, 'adventure')
        .replace(/bilim/g, 'science')
        .replace(/tarih/g, 'history')
        + ' books';

      console.log('Basit çeviri kullanılıyor:', simpleTranslation);
      return simpleTranslation;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mood.trim()) {
      setError('Lütfen ruh halinizi veya istediğiniz kitap türünü yazın.');
      return;
    }

    setLoading(true);
    setBooks([]);
    setError('');

    try {
      const searchTerm = await fetchSearchQueryFromGemini(mood);
      console.log('Oluşturulan arama terimi:', searchTerm);

      const result = await googleBooksService.searchBooks(searchTerm);

      if (result && result.length > 0) {
        setBooks(result);
      } else {
        setError('Bu kriterle ilgili kitap bulunamadı. Lütfen başka bir duygu durumu deneyin.');
      }
    } catch (err) {
      console.error('Hata:', err);
      setError('Bir hata oluştu: ' + (err.message || 'Lütfen tekrar deneyin.'));
    } finally {
      setLoading(false);
    }
  };

  const getBookCover = (info) => {
    // Sadece Google Books'tan doğrudan gelen ve thumbnail URL'i içeren görselleri kabul et
    if (info.imageLinks && info.imageLinks.thumbnail) {
      // Google Books görsellerinin https olduğundan emin ol
      const secureUrl = info.imageLinks.thumbnail.replace('http://', 'https://');
      return secureUrl;
    }
    
    // Diğer tüm durumlar için kapak görseli olmadığını belirt
    return null;
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg px-4 py-2 mb-6">
          <h1 className="text-2xl font-bold text-white">Ruh Haline Göre Kitap Önerisi</h1>
        </div>
        <div className="space-y-6 max-w-3xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="mood" className="block text-sm font-medium text-gray-700">
          Şu anki ruh halinizi veya ne hissettiğinizi yazın:
        </label>
        <textarea
          id="mood"
          rows={3}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Örn: Çok yalnız hissediyorum ve motive edecek bir kitap arıyorum"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
        />

        <button
          type="submit"
          disabled={loading || !mood.trim()}
          className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'Kitaplar Aranıyor...' : 'Kitap Önerisi Al'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <p className="font-medium">Hata:</p>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-2">Kitaplar aranıyor...</span>
        </div>
      )}

      {books.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Size Özel Kitap Önerileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books
              .filter((book) => {
                const info = book.volumeInfo;
                const coverUrl = getBookCover(info);
                // Sadece kapak görseli olanları göster
                return !!coverUrl;
              })
              .map((book) => {
                const info = book.volumeInfo;
                const coverUrl = getBookCover(info);
                return (
                  <Link 
                    key={book.id} 
                    to={`/book/${book.id}`}
                    className="bg-white rounded-lg shadow p-4 flex gap-4 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-24 h-36 flex-shrink-0">
                      <img
                        src={coverUrl}
                        alt={info.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-md font-semibold text-gray-900 hover:text-red-600 transition-colors duration-300">{info.title}</h3>
                      <p className="text-sm text-gray-700">
                        {info.authors ? info.authors.join(', ') : 'Yazar bilgisi yok'}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {info.description ? info.description : 'Açıklama mevcut değil'}
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default AIBookRecommendation;



