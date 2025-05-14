import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import { googleBooksService } from '../services/googleBooksService';
import { useSearch } from '../contexts/SearchContext';

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

// Updated book data with real book covers and descriptions
const featuredBooks = [
  {
    id: 1,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever.',
    rating: 4.5,
    category: 'Fiction'
  },
  {
    id: 2,
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg',
    description: 'A lone astronaut must save the earth from disaster in this incredible new science-based thriller.',
    rating: 4.8,
    category: 'Science Fiction'
  },

];



export default function HomePage() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { searchTerm, searchResults, isSearching } = useSearch();

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
          {searchTerm && searchResults.length > 0 && (
            <div className="mb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Search Results</h2>
                <span className="text-gray-500">{searchResults.length} books found</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((book) => (
                  <div key={book.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="flex p-4">
                      {/* Book Cover */}
                      <div className="w-24 h-36 flex-shrink-0">
                        <img
                          src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x200'}
                          alt={book.volumeInfo.title}
                          className="w-full h-full object-cover rounded-md shadow-sm"
                        />
                      </div>
                      
                      {/* Book Details */}
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {book.volumeInfo.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
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

                        {/* Action Buttons */}
                        <div className="mt-3 flex gap-2">
                          <button className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors">
                            Add to List
                          </button>
                          <Link 
                            to={`/book/${book.id}`}
                            className="text-sm px-3 py-1 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Books Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Books</h2>
              <Link to="/books" className="text-red-600 hover:text-red-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                  <div className="relative h-64">
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm">
                      {book.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
                    <p className="text-gray-600 mb-4">{book.author}</p>
                    <div
                      className="bg-gray-50 border-l-4 border-red-600 p-4 rounded text-gray-700 text-base leading-relaxed shadow-sm"
                      dangerouslySetInnerHTML={{ __html: book.description }}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-gray-600">{book.rating}</span>
                      </div>
                      <Link to={`/books/${book.id}`} className="text-red-600 hover:text-red-700 font-medium">
                        Learn More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          

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