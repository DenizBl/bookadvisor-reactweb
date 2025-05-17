import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import { googleBooksService } from '../services/googleBooksService';
import { useSearch } from '../contexts/SearchContext';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc, collection, query, getDocs } from 'firebase/firestore';

// Icons
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>;
const AccountIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round"  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;


const BookOpenSidebarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;




export default function HomePage() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { searchTerm, searchResults, isSearching, setSearchTerm, setSearchResults } = useSearch();
  const [commentCounts, setCommentCounts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    async function fetchInitialBooks() {
      if (!searchTerm) {
        const results = await googleBooksService.searchBooks('Fiction');
        setSearchResults(results.slice(0, 20));
      }
    }
    fetchInitialBooks();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      const comments = {};
      const likes = {};
      
      for (const book of searchResults) {
        // Fetch comments count
        const commentsRef = collection(db, 'bookComments', book.id, 'comments');
        const commentsQuery = query(commentsRef);
        const commentsSnapshot = await getDocs(commentsQuery);
        comments[book.id] = commentsSnapshot.size;

        // Fetch likes count
        const likesRef = doc(db, 'bookLikes', book.id);
        const likesDoc = await getDoc(likesRef);
        likes[book.id] = likesDoc.exists() ? likesDoc.data().count : 0;
      }

      setCommentCounts(comments);
      setLikeCounts(likes);
    };

    if (searchResults.length > 0) {
      fetchCounts();
    }
  }, [searchResults]);

  const handleLogoutFromSidebar = async () => {
    try {
      await logout();
      toast.success('Successfully logged out!');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed.');
      console.error("Logout error:", error);
    }
  };

  const handleAddToFavorites = async (book) => {
    if (!currentUser) {
      toast.error('Favorilere eklemek için giriş yapmalısınız.');
      return;
    }
    try {
      await setDoc(
        doc(db, 'users', currentUser.uid, 'favorites', book.id),
        {
          id: book.id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors || [],
          thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
          addedAt: new Date(),
        }
      );
      toast.success('Kitap favorilere eklendi!');
    } catch (err) {
      toast.error('Favorilere eklenirken hata oluştu.');
    }
  };

  const sidebarLinks = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Categories', path: '/categories', icon: <CategoryIcon /> },
    { name: 'Favorite Books', path: '/favorites', icon: <HeartIcon /> },
    { name: 'Read Books', path: '/read-books', icon: <BookOpenSidebarIcon /> },
    { name: 'Popular Books', path: '/popular-books', icon: <TrendingUpIcon /> },
    { name: 'Currently Reading', path: '/currently-reading', icon: <ClockIcon /> },
  ];

  if (currentUser) {
    sidebarLinks.push({ name: 'Account', path: '/account', icon: <AccountIcon /> });
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside 
          className={`bg-white shadow-lg fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto flex-shrink-0 z-30 transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-6 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            {isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>

          <div className={`p-6 ${isSidebarCollapsed ? 'px-4' : ''}`}>
            <div className={`mb-8 ${isSidebarCollapsed ? 'text-center' : ''}`}>
              {!isSidebarCollapsed && (
                <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 text-transparent bg-clip-text mb-4">Library Menu</h2>
              )}
              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-150 group ${
                      isSidebarCollapsed ? 'justify-center' : ''
                    } ${link.name === 'Favorite Books' ? 'text-base py-4' : ''}`}
                    title={isSidebarCollapsed ? link.name : ''}
                  >
                    <span className={`text-gray-400 group-hover:text-red-600 transition-colors duration-150 ${
                      link.name === 'Favorite Books' ? 'h-6 w-6' : 'h-5 w-5'
                    }`}>
                      {link.icon}
                    </span>
                    {!isSidebarCollapsed && (
                      <span className={`ml-3 ${link.name === 'Favorite Books' ? 'font-semibold' : ''}`}>
                        {link.name}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
            
            {currentUser && (
              <div className={`pt-4 border-t border-gray-200 ${isSidebarCollapsed ? 'text-center' : ''}`}>
                <button
                  onClick={handleLogoutFromSidebar}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-150 group ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  }`}
                  title={isSidebarCollapsed ? 'Logout' : ''}
                >
                  <span className="text-gray-400 group-hover:text-red-600 transition-colors duration-150">
                    <LogoutIcon />
                  </span>
                  {!isSidebarCollapsed && <span className="ml-3">Logout</span>}
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 bg-gray-50 overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}>
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-6">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                  Welcome to Book Advisor
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-gray-100 mb-8">
                  Your personal guide to discovering amazing books and connecting with fellow readers.
                </p>
              </div>
            </div>
          </section>

          {/* Search Results (from context) */}
          {searchResults.length > 0 && (
            <div className="mb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Search Results</h2>
                <span className="text-gray-500">{searchResults.length} books found</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((book) => (
                  <div key={book.id} className="bg-[#f7e8e6] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-[300px] transform hover:-translate-y-1 hover:scale-[1.02] group">
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
                          
                          {/* Rating */}
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              <span className="text-yellow-400 group-hover:scale-110 transition-transform duration-300">★</span>
                              <span className="ml-1 text-sm text-gray-600">
                                {book.volumeInfo.averageRating ? 
                                  `${book.volumeInfo.averageRating.toFixed(1)} (${book.volumeInfo.ratingsCount || 0})` : 
                                  'No ratings'}
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

                      {/* Action Buttons */}
                      <div className="mt-auto flex flex-col gap-2 border-t border-gray-200 pt-4">
                        <div className="flex justify-around">
                          <button
                            onClick={() => handleAddToFavorites(book)}
                            className="group/btn flex items-center gap-1.5 text-sm px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            Add to Favorites
                          </button>
                          <Link
                            to={`/book/${book.id}`}
                            className="group/btn flex items-center gap-1.5 text-sm px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            Details
                          </Link>
                        </div>
                        <div className="flex justify-around">
                          <Link
                            to={`/book/${book.id}`}
                            className="group/btn flex items-center gap-1.5 text-sm px-4 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {commentCounts[book.id] || 0} Comments
                          </Link>
                          <Link
                            to={`/book/${book.id}`}
                            className="group/btn flex items-center gap-1.5 text-sm px-4 py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {likeCounts[book.id] || 0} Likes
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

         

          

          {/* Newsletter Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-red-700">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
              <p className="text-xl text-gray-100 mb-8">
                Subscribe to our newsletter for the latest book recommendations and updates.
              </p>
              <form className="max-w-md mx-auto flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}