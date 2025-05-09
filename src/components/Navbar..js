// src/components/Navbar.js

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // AuthContext yolunuzu doğrulayın
import toast from 'react-hot-toast';

// Basit İkonlar (SVG) - Önceki örneklerden veya kendi ikonlarınızdan
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const UserCircleIcon = ({ className = "h-7 w-7" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
// Sidebar'dan ikonlar
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>;
const AccountIconNav = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-0.257-.257A6 6 0 1118 8zM10 16a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" /><path fillRule="evenodd" d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zM8 11a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" /></svg>;


export default function Navbar() {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      setIsProfileDropdownOpen(false); // Önce dropdown'ı kapat
      setIsMobileMenuOpen(false); // Mobil menüyü de kapat
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
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`); // Gerçek arama sayfasına yönlendir
      setSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };

  // Dışarı tıklandığında profil dropdown'ını kapat
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownRef]);

  const commonLinks = [
    { name: 'Anasayfa', path: '/', icon: <HomeIcon /> },
    { name: 'Kategoriler', path: '/categories', icon: <CategoryIcon /> },
  ];

  const userSpecificLinks = [];
  if (currentUser) {
    userSpecificLinks.push({ name: 'Hesabım', path: '/account', icon: <AccountIconNav /> });
    if (userRole === 'admin') {
      userSpecificLinks.push({ name: 'Admin Panel', path: '/admin/books', icon: <AdminIcon /> });
    }
  }

  const NavLinkItem = ({ to, children, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
          isActive
            ? 'bg-red-100 text-red-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      {children}
    </NavLink>
  );


  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Sol Taraf: Logo ve Ana Linkler (Desktop) */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-2xl font-bold text-red-600 hover:text-red-700 mr-6">
              Book Advisor
            </Link>
            <div className="hidden md:flex md:space-x-2">
              {commonLinks.map(link => (
                <NavLinkItem key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)}>
                  {link.icon} <span className="ml-1">{link.name}</span>
                </NavLinkItem>
              ))}
              {userSpecificLinks.map(link => (
                 <NavLinkItem key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)}>
                  {link.icon} <span className="ml-1">{link.name}</span>
                </NavLinkItem>
              ))}
            </div>
          </div>

          {/* Orta: Arama Çubuğu (Desktop) */}
          <div className="hidden md:flex flex-grow max-w-xs lg:max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Kitap, yazar..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
            </form>
          </div>

          {/* Sağ Taraf: Kullanıcı İşlemleri (Desktop) & Mobil Menü Butonu */}
          <div className="flex items-center">
            <div className="hidden md:block">
              {currentUser ? (
                <div className="ml-4 relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    id="user-menu-button"
                    aria-expanded={isProfileDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Kullanıcı menüsünü aç</span>
                    <UserCircleIcon className="h-8 w-8 text-gray-600 hover:text-red-600" />
                  </button>
                  {isProfileDropdownOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      <Link
                        to="/account"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Hesabım
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-x-2">
                  <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Giriş Yap
                  </Link>
                  <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600">
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
            {/* Mobil Menü Butonu */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Ana menüyü aç</span>
                {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobil Menü */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {commonLinks.map(link => (
              <NavLinkItem key={link.name + "-mobile"} to={link.path} onClick={() => setIsMobileMenuOpen(false)}>
                {link.icon} {link.name}
              </NavLinkItem>
            ))}
             {userSpecificLinks.map(link => (
              <NavLinkItem key={link.name + "-mobile"} to={link.path} onClick={() => setIsMobileMenuOpen(false)}>
                {link.icon} {link.name}
              </NavLinkItem>
            ))}
            {/* Arama Çubuğu (Mobil) */}
            <form onSubmit={handleSearch} className="px-1 pt-2">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ara..."
                className="block w-full pl-4 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </form>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {currentUser ? (
              <>
                <div className="flex items-center px-4">
                  <UserCircleIcon className="h-10 w-10 text-gray-500" />
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{currentUser.displayName || currentUser.email?.split('@')[0]}</div>
                    <div className="text-sm font-medium text-gray-500">{currentUser.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <NavLinkItem to="/account" onClick={() => setIsMobileMenuOpen(false)}>
                    Hesabım
                  </NavLinkItem>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </>
            ) : (
              <div className="px-2 space-y-1">
                <NavLinkItem to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  Giriş Yap
                </NavLinkItem>
                <NavLinkItem to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  Kayıt Ol
                </NavLinkItem>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}