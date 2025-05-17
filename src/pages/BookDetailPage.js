// src/pages/BookDetailPage.js (veya sizin dosya yolunuz)

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { googleBooksService } from '../services/googleBooksService';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, setDoc, increment } from 'firebase/firestore';
import Header from '../components/Header';

// Utility to decode HTML entities
function decodeHtmlEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [success, setSuccess] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);
        const data = await googleBooksService.getBookById(id);
        setBook(data);
      } catch (err) {
        setError('Kitap detayları yüklenirken bir hata oluştu.');
        console.error('Error fetching book details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  // Fetch comments in real-time
  useEffect(() => {
    const q = query(
      collection(db, 'bookComments', id, 'comments'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, [id]);

  // Fetch likes count and user's like status
  useEffect(() => {
    const fetchLikes = async () => {
      if (!currentUser) return;
      
      const likesRef = doc(db, 'bookLikes', id);
      const userLikeRef = doc(db, 'bookLikes', `${id}_${currentUser.uid}`);
      
      try {
        const likesDoc = await getDoc(likesRef);
        const userLikeDoc = await getDoc(userLikeRef);
        
        if (!likesDoc.exists()) {
          // Initialize likes count to 0 if it doesn't exist
          await setDoc(likesRef, { count: 0 });
          setLikes(0);
        } else {
          setLikes(likesDoc.data().count);
        }
        
        if (userLikeDoc.exists()) {
          setHasLiked(userLikeDoc.data().liked);
        }
      } catch (err) {
        console.error('Error fetching likes:', err);
      }
    };

    fetchLikes();
  }, [id, currentUser]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const now = new Date();
    try {
      await addDoc(collection(db, 'bookComments', id, 'comments'), {
        name: currentUser?.displayName || currentUser?.email || 'Anonim',
        text: comment.trim(),
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: now,
      });
      setComment('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleLike = async () => {
    if (!currentUser || isLiking) {
      return;
    }

    setIsLiking(true);
    const likesRef = doc(db, 'bookLikes', id);
    const userLikeRef = doc(db, 'bookLikes', `${id}_${currentUser.uid}`);

    try {
      // First check if the user has already liked
      const userLikeDoc = await getDoc(userLikeRef);
      const currentLikeStatus = userLikeDoc.exists() ? userLikeDoc.data().liked : false;

      // Only proceed if the current status is different from what we want to set
      if (currentLikeStatus !== !hasLiked) {
        if (!hasLiked) {
          // Add like
          await setDoc(likesRef, { count: increment(1) }, { merge: true });
          await setDoc(userLikeRef, { liked: true });
          setLikes(prev => prev + 1);
          setHasLiked(true);
        } else {
          // Remove like
          await setDoc(likesRef, { count: increment(-1) }, { merge: true });
          await setDoc(userLikeRef, { liked: false });
          setLikes(prev => prev - 1);
          setHasLiked(false);
        }
      }
    } catch (err) {
      console.error('Error updating like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg mb-4">Kitap bulunamadı.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const { volumeInfo } = book;
  const decodedDescription = volumeInfo.description ? decodeHtmlEntities(volumeInfo.description) : '';

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg px-4 py-2 mb-6">
          <h1 className="text-2xl font-bold text-white">
            Kitap Detayları
            <span className="text-sm font-normal text-red-100 ml-2">
              {volumeInfo?.title || 'Yükleniyor...'}
            </span>
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Book Cover */}
            <div className="md:flex-shrink-0 p-6">
              <img
                className="h-64 w-48 object-cover rounded-lg shadow-md mx-auto md:mx-0" // Eklendi: mx-auto md:mx-0
                src={volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x220.png?text=Kapak+Yok'} // Placeholder güncellendi
                alt={volumeInfo.title}
              />
            </div>

            {/* Book Details */}
            <div className="p-6 flex-grow"> {/* Eklendi: flex-grow */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {volumeInfo.title}
              </h1>
              {volumeInfo.subtitle && ( // Altyazı varsa göster
                <h2 className="text-xl text-gray-500 mb-3">{volumeInfo.subtitle}</h2>
              )}
              
              {volumeInfo.authors && (
                <p className="text-xl text-gray-600 mb-4">
                  Yazar: {volumeInfo.authors.join(', ')}
                </p>
              )}

              {/* Additional Details (as horizontal list) */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-gray-600 text-sm"> {/* gap-x-6 gap-y-2 */}
                {volumeInfo.publisher && (
                  <span><strong>Yayınevi:</strong> {volumeInfo.publisher}</span>
                )}
                {volumeInfo.publishedDate && (
                  <span><strong>Yayın Tarihi:</strong> {new Date(volumeInfo.publishedDate).toLocaleDateString('tr-TR')}</span>
                )}
                {volumeInfo.pageCount && (
                  <span><strong>Sayfa:</strong> {volumeInfo.pageCount}</span>
                )}
                {volumeInfo.language && ( // Dil bilgisi eklendi
                  <span><strong>Dil:</strong> {volumeInfo.language.toUpperCase()}</span>
                )}
              </div>

              {/* Styled Description */}
              {volumeInfo.description && (
                <div className="mt-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">Açıklama</h2> {/* text-gray-800 */}
                  <div 
                    className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none bg-gray-50 border-l-4 border-red-600 p-4 rounded text-gray-700 leading-relaxed shadow-sm"
                    dangerouslySetInnerHTML={{ __html: decodedDescription }}
                  >
                  </div>
                </div>
              )}

              {volumeInfo.categories && volumeInfo.categories.length > 0 && ( // categories boş değilse
                <div className="mt-6"> {/* mt-6 yapıldı */}
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">Kategoriler</h2> {/* text-gray-800 */}
                  <div className="flex flex-wrap gap-2">
                    {volumeInfo.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium" // text-xs font-medium
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {volumeInfo.averageRating && (
                <div className="mt-6"> {/* mt-6 yapıldı */}
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">Değerlendirme</h2> {/* text-gray-800 */}
                  <div className="flex items-center">
                    <span className="text-yellow-400">
                      {'★'.repeat(Math.round(volumeInfo.averageRating))}
                      {'☆'.repeat(5 - Math.round(volumeInfo.averageRating))}
                    </span>
                    <span className="ml-2 text-gray-600 text-sm"> {/* text-sm */}
                      ({volumeInfo.ratingsCount || 0} değerlendirme)
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-4"> {/* mt-8 yapıldı */}
                {volumeInfo.previewLink && (
                  <a
                    href={volumeInfo.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Google Books'ta Görüntüle
                  </a>
                )}
                {volumeInfo.infoLink && (
                  <a
                    href={volumeInfo.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Daha Fazla Bilgi
                  </a>
                )}
                <button
                  onClick={handleLike}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-md transition-colors text-sm font-medium ${
                    hasLiked 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  disabled={!currentUser || isLiking}
                >
                  <span>{hasLiked ? '❤️' : '🤍'}</span>
                  <span>{likes} Beğeni</span>
                </button>
              </div>
            </div>
          </div>
          {/* Comment Section */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Yorum Yap</h2>
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Yorumunuzu yazın..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                disabled={!comment.trim()}
              >
                Gönder
              </button>
              {success && <div className="text-green-600 mt-2">Yorumunuz gönderildi!</div>}
            </form>
            {comments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Yorumlar</h3>
                <ul className="space-y-2">
                  {comments.map((c, idx) => (
                    <li key={idx} className="bg-gray-50 border border-gray-200 rounded p-3 text-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-red-700">{c.name}</span>
                        <span className="text-xs text-gray-500">{c.date} {c.time}</span>
                      </div>
                      <div>{c.text}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}