import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import { googleBooksService } from '../services/googleBooksService';
import { useSearch } from '../contexts/SearchContext';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc, collection, query, getDocs, deleteDoc } from 'firebase/firestore';
import AIBookRecommendation from '../components/AIBookRecommendation';

// Icons
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11.47 3.84a.75.75 0 011.06 0l7.5 7.5a.75.75 0 01-1.06 1.06L12 5.43 5.03 12.4a.75.75 0 01-1.06-1.06l7.5-7.5z"/><path d="M12 2.25a.75.75 0 01.53.22l8.25 8.25a.75.75 0 01-.53 1.28H18v6.75a3 3 0 01-3 3H9a3 3 0 01-3-3V12H3.75a.75.75 0 01-.53-1.28L11.47 2.47a.75.75 0 01.53-.22z"/></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM3.75 19.125a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 19.125a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0z"/></svg>;
const AccountIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd"/></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/></svg>;
const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 3a2 2 0 00-2 2v16l9-4 9 4V5a2 2 0 00-2-2H5z" />
  </svg>
);



const BookOpenSidebarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z"/></svg>;
const SquareCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd"/></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M15.22 6.268a.75.75 0 01.968-.432l5.942 2.28a.75.75 0 01.431.97l-2.28 5.941a.75.75 0 11-1.4-.537l1.63-4.251-1.086.483a11.2 11.2 0 00-5.45 5.174.75.75 0 01-1.199.19L9 12.31l-6.22 6.22a.75.75 0 11-1.06-1.06l6.75-6.75a.75.75 0 011.06 0l3.606 3.605a12.7 12.7 0 015.68-4.973l1.086-.483-4.251-1.632a.75.75 0 01-.432-.97z" clipRule="evenodd"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd"/></svg>;
const HourglassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6.5 2.25A.75.75 0 017.25 1.5h9.5a.75.75 0 01.75.75v2.5a3.25 3.25 0 01-1.12 2.47l-2.88 2.5a.75.75 0 000 1.06l2.88 2.5A3.25 3.25 0 0117.5 15.25v2.5a.75.75 0 01-.75.75h-9.5a.75.75 0 01-.75-.75v-2.5a3.25 3.25 0 011.12-2.47l2.88-2.5a.75.75 0 000-1.06l-2.88-2.5A3.25 3.25 0 016.5 4.75v-2.5zM8 4.75A1.75 1.75 0 009.75 3h4.5A1.75 1.75 0 0016 4.75v.5c0 .414-.336.75-.75.75H8.75a.75.75 0 01-.75-.75v-.5zm0 14.5v-.5c0-.414.336-.75.75-.75h6.5c.414 0 .75.336.75.75v.5A1.75 1.75 0 0114.25 21h-4.5A1.75 1.75 0 018 19.25z"/><path d="M12 12a.5.5 0 11-1 0 .5.5 0 011 0z"/></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M15.75 19.5L8.25 12l7.5-7.5a.75.75 0 00-1.06-1.06L6.44 11.69a.75.75 0 000 1.06l8.25 8.25a.75.75 0 001.06-1.06z" clipRule="evenodd"/></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M8.25 4.5l7.5 7.5-7.5 7.5a.75.75 0 001.06 1.06l8.25-8.25a.75.75 0 000-1.06L9.31 3.44a.75.75 0 00-1.06 1.06z" clipRule="evenodd"/></svg>;

// Mood to category mapping
const moodToCategory = {
  happy: ['Humor', 'Comedy', 'Adventure'],
  sad: ['Self-Help', 'Inspiration', 'Poetry'],
  stressed: ['Meditation', 'Mindfulness', 'Self-Help'],
  excited: ['Adventure', 'Science Fiction', 'Fantasy'],
  relaxed: ['Poetry', 'Nature', 'Travel'],
  anxious: ['Psychology', 'Self-Help', 'Meditation'],
  romantic: ['Romance', 'Poetry', 'Love Stories'],
  nostalgic: ['Historical Fiction', 'Memoir', 'Biography'],
  curious: ['Science', 'Philosophy', 'History'],
  tired: ['Short Stories', 'Poetry', 'Comedy']
};

export default function HomePage() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { searchTerm, searchResults, isSearching, setSearchTerm, setSearchResults } = useSearch();
  const [commentCounts, setCommentCounts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [mood, setMood] = useState('');
  const [isMoodSearching, setIsMoodSearching] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [userFavorites, setUserFavorites] = useState(new Set());

  useEffect(() => {
    async function fetchInitialBooks() {
      if (!searchTerm && searchResults.length === 0) {
        const results = await googleBooksService.searchBooks('Fiction');
        setSearchResults(results.slice(0, 20));
      }
    }
    fetchInitialBooks();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (!currentUser) {
        setUserFavorites(new Set());
        return;
      }
      
      try {
        const favoritesRef = collection(db, 'users', currentUser.uid, 'favorites');
        const favoritesSnapshot = await getDocs(favoritesRef);
        const favoriteIds = new Set();
        favoritesSnapshot.forEach((doc) => {
          favoriteIds.add(doc.id);
        });
        setUserFavorites(favoriteIds);
      } catch (error) {
        console.error('Error fetching user favorites:', error);
      }
    };

    fetchUserFavorites();
  }, [currentUser]);

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
      toast.error('Listeye eklemek için giriş yapmalısınız.');
      return;
    }
    
    try {
      if (userFavorites.has(book.id)) {
        // Remove from favorites
        await deleteDoc(doc(db, 'users', currentUser.uid, 'favorites', book.id));
        setUserFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(book.id);
          return newSet;
        });
        toast.success('Kitap favorilerden çıkarıldı!');
      } else {
        // Add to favorites
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
        setUserFavorites(prev => new Set(prev).add(book.id));
        toast.success('Kitap favorilere eklendi!');
      }
    } catch (err) {
      toast.error('Favorilere eklenirken hata oluştu.');
    }
  };

  const handleMoodSearch = async (e) => {
    e.preventDefault();
    if (!mood.trim()) return;

    setIsMoodSearching(true);
    try {
      // Get categories for the mood
      const categories = moodToCategory[mood.toLowerCase()] || ['Fiction'];
      
      // Search for books in each category and combine results
      const allResults = [];
      for (const category of categories) {
        const results = await googleBooksService.searchBooks(category);
        allResults.push(...results);
      }
      
      // Remove duplicates and limit to 20 books
      const uniqueResults = Array.from(new Map(allResults.map(book => [book.id, book])).values()).slice(0, 20);
      setSearchResults(uniqueResults);
      
      toast.success(`Found books that might help with your ${mood} mood!`);
    } catch (error) {
      console.error('Error searching books by mood:', error);
      toast.error('Failed to find mood-based recommendations');
    } finally {
      setIsMoodSearching(false);
    }
  };

  const sidebarLinks = [
    { name: 'Anasayfa', path: '/', icon: <HomeIcon /> },
    { name: 'Ruh Haline Göre', path: '/aibook', icon: <BookOpenSidebarIcon /> },
    { name: 'Kategoriler', path: '/categories', icon: <CategoryIcon /> },
    { name: 'Listem', path: '/favorites', icon: <SaveIcon /> },
    { name: 'Okuduklarım', path: '/okuduklarim', icon: <SquareCheckIcon /> },
    { name: 'Halen Okuyorum', path: '/currently-reading', icon: <HourglassIcon /> },
    { name: 'Popüler Kitaplar', path: '/popular-books', icon: <TrendingUpIcon /> },
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
          <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-4">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                  Welcome to Book Advisor
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-gray-100">
                  Your personal guide to discovering amazing books and connecting with fellow readers.
                </p>
              </div>
            </div>
          </section>

          {/* AI Chat Button */}
          <button
            onClick={() => setShowAIChat(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="AI Kitap Önerisi"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <circle cx="9" cy="10" r="1.5" fill="currentColor" />
              <circle cx="15" cy="10" r="1.5" fill="currentColor" />
              <path strokeLinecap="round" strokeWidth="2" d="M9 16h6" />
              <path strokeLinecap="round" strokeWidth="1.5" d="M8 7l2-2M16 7l-2-2" />
            </svg>
          </button>

          {/* AI Chat Modal */}
          {showAIChat && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Yapay Zeka Kitap Önerisi</h2>
                    <button
                      onClick={() => setShowAIChat(false)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <AIBookRecommendation headers={{
                    'Content-Type': 'application/json',
                    'x-goog-api-key': 'AIzaSyBknoExOY5GDhOiTdIkjW6YtVhMYnGyeVU'
                  }} />
                </div>
              </div>
            </div>
          )}

          {/* Mood Input Section */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-xl p-8 border border-red-100">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">How are you feeling today?</h2>
                  <p className="text-lg text-gray-600">
                    Let us help you find the perfect book for your mood
                  </p>
                </div>
                
                <form onSubmit={handleMoodSearch} className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      placeholder="Enter your mood (e.g., happy, sad, stressed)"
                      className="w-full px-6 py-4 text-lg border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200"
                      list="mood-suggestions"
                    />
                    <datalist id="mood-suggestions">
                      {Object.keys(moodToCategory).map((mood) => (
                        <option key={mood} value={mood} />
                      ))}
                    </datalist>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center">
                    {Object.keys(moodToCategory).map((suggestedMood) => (
                      <button
                        key={suggestedMood}
                        type="button"
                        onClick={() => setMood(suggestedMood)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                          mood === suggestedMood
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-red-50 border border-red-200'
                        }`}
                      >
                        {suggestedMood.charAt(0).toUpperCase() + suggestedMood.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isMoodSearching}
                      className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-lg"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {isMoodSearching ? (
                          <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Finding Books...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Find Books
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    We'll recommend books that match your current mood and help you feel better.
                  </p>
                </div>
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
                  <div key={book.id} className="bg-[#f7e8e6] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 min-h-[265px] flex flex-col transform hover:-translate-y-1 hover:scale-[1.02] group">
                    <div className="flex flex-col p-4 h-full">
                      {/* Top Section - Book Info */}
                      <div className="flex mb-3">
                        {/* Book Cover */}
                        <Link to={`/book/${book.id}`} className="w-20 h-28 flex-shrink-0 block">
                          <img
                            src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x200'}
                            alt={book.volumeInfo.title}
                            className="w-full h-full object-cover rounded-md shadow-sm group-hover:shadow-md transition-all duration-300"
                          />
                        </Link>
                        
                        {/* Book Details */}
                        <div className="ml-3 flex-1 flex flex-col">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                            {book.volumeInfo.title}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                            {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                          </p>
                          
                          {/* Rating */}
                          <div className="flex items-center mb-2">
                            <span className="text-yellow-400 text-sm">★</span>
                            <span className="ml-1 text-xs text-gray-600">
                              {book.volumeInfo.averageRating ? 
                                `${book.volumeInfo.averageRating.toFixed(1)}` : 
                                'No rating'}
                            </span>
                          </div>

                          {/* Additional Details */}
                          <div className="text-xs text-gray-500 flex-1 mb-1 leading-tight">
                            {book.volumeInfo.publishedDate && <p className="mb-[2px]">{new Date(book.volumeInfo.publishedDate).getFullYear()}</p>}
                            {book.volumeInfo.pageCount && <p className="mb-0">{book.volumeInfo.pageCount} pages</p>}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Section - Action Buttons */}
                      <div className="mt-auto pt-3 border-t border-white/50">
                        {/* Main Actions */}
                        <div className="flex gap-2 mb-2">
                          <button
                            onClick={() => handleAddToFavorites(book)}
                            className="flex-1 group/btn flex items-center justify-center gap-1 text-xs px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            {userFavorites.has(book.id) ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 3a3 3 0 00-3 3v12l9-4 9 4V6a3 3 0 00-3-3H6z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                              </svg>
                            )}
                            <span className="hidden sm:inline">
                              {userFavorites.has(book.id) ? 'Remove' : 'Add'}
                            </span>
                          </button>
                          <Link
                            to={`/book/${book.id}`}
                            className="flex-1 group/btn flex items-center justify-center gap-1 text-xs px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="hidden sm:inline">Details</span>
                          </Link>
                        </div>
                        
                        {/* Secondary Actions */}
                        <div className="flex gap-2">
                          <Link
                            to={`/book/${book.id}`}
                            className="flex-1 group/btn flex items-center justify-center gap-1 text-xs px-2 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{commentCounts[book.id] || 0}</span>
                          </Link>
                          <Link
                            to={`/book/${book.id}`}
                            className="flex-1 group/btn flex items-center justify-center gap-1 text-xs px-2 py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{likeCounts[book.id] || 0}</span>
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