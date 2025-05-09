
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // AuthContext yolunuzu doğrulayın
import Header from '../components/Header'; // Header bileşenini import edin
import toast from 'react-hot-toast';

// Sidebar için ikonlar (opsiyonel, isterseniz ekleyebilirsiniz)
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>;
const AccountIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const HeartIcon = () => <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21C12 21 4 13.5 4 8a4 4 0 018-2 4 4 0 018 2c0 5.5-8 13-8 13z" /></svg>;
const BookOpenIcon = () => <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9M12 4H3v16h9m0-16v16m0-16l9 16" /></svg>;
const TrendingUpIcon = () => <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></svg>;
const ClockIcon = () => <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" /></svg>;


export default function HomePage() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogoutFromSidebar = async () => {
    try {
      await logout();
      toast.success('Başarıyla çıkış yapıldı!');
      navigate('/login');
    } catch (error) {
      toast.error('Çıkış yapılamadı.');
      console.error("Çıkış hatası:", error);
    }
  };

  // const sidebarLinks = [
  //   { name: 'Anasayfa', path: '/', icon: <HomeIcon /> },
  //   { name: 'Kategoriler', path: '/categories', icon: <CategoryIcon /> }, // Örnek bir rota
  // ];

  const sidebarLinks = [
    { name: 'Anasayfa', path: '/', icon: <HomeIcon /> },
    { name: 'Kategoriler', path: '/categories', icon: <CategoryIcon /> },
    { name: 'Favori Kitaplar', path: '/favorites', icon: <HeartIcon /> },
    { name: 'Okuduğum Kitaplar', path: '/read-books', icon: <BookOpenIcon /> },
    { name: 'En Çok Okunanlar', path: '/popular-books', icon: <TrendingUpIcon /> },
    { name: 'Şu Anda Okuduklarım', path: '/currently-reading', icon: <ClockIcon /> },
  ];
  

  if (currentUser) {
    sidebarLinks.push({ name: 'Account', path: '/account', icon: <AccountIcon /> });
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        {/* Sol Sidebar */}
        <aside className="w-64 bg-white p-4 shadow-lg space-y-2 hidden md:block"> {/* md:block ile mobilde gizle, tablette/desktopta göster */}
          <nav>
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors duration-150"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            {currentUser && (
               <button
                onClick={handleLogoutFromSidebar}
                className="w-full flex items-center mt-4 px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors duration-150"
              >
                <LogoutIcon />
                Logout
              </button>
            )}
          </nav>
        </aside>

        {/* Ana İçerik Alanı */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Anasayfa</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-700">
              Book Advisor ana sayfasına hoş geldiniz! Burada en son eklenen kitapları,
              popüler kategorileri ve size özel önerileri bulabilirsiniz.
            </p>
            {/* Buraya ana sayfa içeriğiniz gelecek */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Örnek Kartlar */}
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
                  <div className="w-full h-40 bg-gray-300 rounded-md mb-3 animate-pulse"></div> {/* Resim placeholder */}
                  <h3 className="text-lg font-semibold text-red-600 mb-1">Örnek Kitap Adı {i}</h3>
                  <p className="text-sm text-gray-500 mb-2">Yazar Adı</p>
                  <p className="text-xs text-gray-600">Kısa bir kitap açıklaması veya tanıtımı burada yer alabilir.</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

