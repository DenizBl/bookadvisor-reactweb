import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // AuthContext yolunuzu doğrulayın
import toast from 'react-hot-toast';
import { useSearch } from '../contexts/SearchContext';

// Basit İkonlar (SVG)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-600" style={{color: '#6b7280'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, setSearchTerm, searchBooks, isSearching } = useSearch();

  // Ana sayfa olup olmadığını kontrol et
  const isHomePage = location.pathname === '/';

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Başarıyla çıkış yapıldı!');
      navigate('/login');
    } catch (error) {
      toast.error('Çıkış yapılamadı.');
      console.error("Çıkış hatası:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchBooks(searchTerm);
    }
  };

  const handleBack = () => {
    navigate(-1); // React Router'ın built-in geri gitme fonksiyonu
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Sol Taraf: Geri Tuşu (ana sayfa değilse) + Logo/Başlık */}
          <div className="flex items-center space-x-3">
            {!isHomePage && (
              <button
                onClick={handleBack}
                className="inline-flex items-center p-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: '#b91c1c',
                  borderColor: '#b91c1c'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#991b1b';
                  e.target.style.borderColor = '#991b1b';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#b91c1c';
                  e.target.style.borderColor = '#b91c1c';
                }}
                title="Geri Git"
              >
                <BackIcon />
                <span className="ml-1 font-medium text-sm hidden sm:block">Geri</span>
              </button>
            )}
            <Link to="/" className="text-2xl font-bold transition-colors duration-200" style={{color: '#b91c1c'}}
                  onMouseEnter={(e) => e.target.style.color = '#991b1b'}
                  onMouseLeave={(e) => e.target.style.color = '#b91c1c'}>
              Book Advisor
            </Link>
          </div>

          {/* Orta: Arama Çubuğu */}
          <div className="flex-grow max-w-xl mx-4">
            <form onSubmit={handleSearch} className="relative flex">
              <input
                type="search"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Kitap, yazar veya tür ara..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 sm:text-sm"
                style={{'--focus-ring-color': '#b91c1c', '--focus-border-color': '#b91c1c'}}
                onFocus={(e) => {
                  e.target.style.ringColor = '#b91c1c';
                  e.target.style.borderColor = '#b91c1c';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                }}
                disabled={isSearching}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 text-white rounded-r-md focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors duration-200"
                style={{ 
                  marginLeft: '-1px',
                  backgroundColor: '#b91c1c'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#991b1b'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#b91c1c'}
              >
                Search
              </button>
            </form>
          </div>

          {/* Sağ Taraf: Kullanıcı Bilgileri ve Çıkış */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="text-sm text-gray-600 hidden md:block">{currentUser.email}</span>
                <Link to="/account" title="Hesabım" className="hover:opacity-75 transition-opacity duration-200">
                  <UserCircleIcon />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                  style={{backgroundColor: '#b91c1c'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#991b1b'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#b91c1c'}
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 transition-colors duration-200"
                      onMouseEnter={(e) => e.target.style.color = '#b91c1c'}
                      onMouseLeave={(e) => e.target.style.color = '#4b5563'}>
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200"
                  style={{backgroundColor: '#b91c1c'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#991b1b'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#b91c1c'}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}