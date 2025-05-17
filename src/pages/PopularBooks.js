import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { googleBooksService } from '../services/googleBooksService';

const PopularBooks = () => {
  const [likedBooks, setLikedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedBooks = async () => {
      try {
        // Get all book likes
        const likesRef = collection(db, 'bookLikes');
        const likesSnapshot = await getDocs(likesRef);
        
        // Filter out user-specific likes and get only the book likes
        const bookLikes = likesSnapshot.docs
          .filter(doc => !doc.id.includes('_')) // Exclude user-specific likes
          .map(doc => ({
            id: doc.id,
            likes: doc.data().count
          }))
          .sort((a, b) => b.likes - a.likes); // Sort by number of likes

        // Fetch book details for each liked book
        const booksWithDetails = await Promise.all(
          bookLikes.map(async (book) => {
            try {
              const bookDetails = await googleBooksService.getBookById(book.id);
              return {
                ...bookDetails,
                likes: book.likes
              };
            } catch (error) {
              console.error(`Error fetching book ${book.id}:`, error);
              return null;
            }
          })
        );

        // Filter out any null values and set the state
        setLikedBooks(booksWithDetails.filter(book => book !== null));
      } catch (error) {
        console.error('Error fetching liked books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedBooks();
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg px-4 py-2 mb-6">
          <h1 className="text-2xl font-bold text-white">
            Popüler Kitaplar
            <span className="text-sm font-normal text-red-100 ml-2">
              {likedBooks.length} kitap
            </span>
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {likedBooks.map((book) => (
            <div key={book.id} className="bg-[#f7e8e6] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] group">
              <div className="flex flex-col p-4 h-full">
                <div className="flex flex-1">
                  {/* Book Cover */}
                  <Link to={`/book/${book.id}`} className="w-24 h-36 flex-shrink-0 block">
                    <img
                      src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x200'}
                      alt={book.volumeInfo.title}
                      className="w-full h-full object-cover rounded-md shadow-sm group-hover:shadow-md transition-all duration-300"
                    />
                  </Link>
                  
                  {/* Book Details */}
                  <div className="ml-4 flex-1 overflow-hidden">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                      {book.volumeInfo.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                      {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                    </p>
                    
                    {/* Likes Count */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-red-500 group-hover:scale-110 transition-transform duration-300">❤️</span>
                        <span className="ml-1 text-sm text-gray-600">
                          {book.likes} Likes
                        </span>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="text-xs text-gray-500 space-y-1">
                      {book.volumeInfo.publishedDate && (
                        <p>Published: {new Date(book.volumeInfo.publishedDate).getFullYear()}</p>
                      )}
                      {book.volumeInfo.pageCount && (
                        <p>{book.volumeInfo.pageCount} pages</p>
                      )}
                      {book.volumeInfo.categories && (
                        <p className="line-clamp-1">{book.volumeInfo.categories[0]}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto pt-4">
                  <Link
                    to={`/book/${book.id}`}
                    className="w-full flex items-center justify-center gap-1.5 text-sm px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularBooks;
