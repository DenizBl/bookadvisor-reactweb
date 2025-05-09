
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext'; // AuthContext yolunuzu doğrulayın
// import Header from '../components/Header'; // Header bileşenini import edin
// import toast from 'react-hot-toast';

// // Sidebar için ikonlar (opsiyonel, isterseniz ekleyebilirsiniz)
// const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
// const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>;
// const AccountIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
// const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
// const HeartIcon = () => <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21C12 21 4 13.5 4 8a4 4 0 018-2 4 4 0 018 2c0 5.5-8 13-8 13z" /></svg>;
// const BookOpenIcon = () => <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9M12 4H3v16h9m0-16v16m0-16l9 16" /></svg>;
// const TrendingUpIcon = () => <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></svg>;
// const ClockIcon = () => <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" /></svg>;


// export default function HomePage() {
//   const { logout, currentUser } = useAuth();
//   const navigate = useNavigate();

//   const handleLogoutFromSidebar = async () => {
//     try {
//       await logout();
//       toast.success('Başarıyla çıkış yapıldı!');
//       navigate('/login');
//     } catch (error) {
//       toast.error('Çıkış yapılamadı.');
//       console.error("Çıkış hatası:", error);
//     }
//   };

//   // const sidebarLinks = [
//   //   { name: 'Anasayfa', path: '/', icon: <HomeIcon /> },
//   //   { name: 'Kategoriler', path: '/categories', icon: <CategoryIcon /> }, // Örnek bir rota
//   // ];

//   const sidebarLinks = [
//     { name: 'Anasayfa', path: '/', icon: <HomeIcon /> },
//     { name: 'Kategoriler', path: '/categories', icon: <CategoryIcon /> },
//     { name: 'Favori Kitaplar', path: '/favorites', icon: <HeartIcon /> },
//     { name: 'Okuduğum Kitaplar', path: '/read-books', icon: <BookOpenIcon /> },
//     { name: 'En Çok Okunanlar', path: '/popular-books', icon: <TrendingUpIcon /> },
//     { name: 'Şu Anda Okuduklarım', path: '/currently-reading', icon: <ClockIcon /> },
//   ];
  

//   if (currentUser) {
//     sidebarLinks.push({ name: 'Account', path: '/account', icon: <AccountIcon /> });
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Header />
//       <div className="flex flex-1">
//         {/* Sol Sidebar */}
//         <aside className="w-64 bg-white p-4 shadow-lg space-y-2 hidden md:block"> {/* md:block ile mobilde gizle, tablette/desktopta göster */}
//           <nav>
//             {sidebarLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 to={link.path}
//                 className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors duration-150"
//               >
//                 {link.icon}
//                 {link.name}
//               </Link>
//             ))}
//             {currentUser && (
//                <button
//                 onClick={handleLogoutFromSidebar}
//                 className="w-full flex items-center mt-4 px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors duration-150"
//               >
//                 <LogoutIcon />
//                 Logout
//               </button>
//             )}
//           </nav>
//         </aside>

//         {/* Ana İçerik Alanı */}
//         <main className="flex-1 p-6">
//           <h1 className="text-3xl font-semibold text-gray-800 mb-6">Anasayfa</h1>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-gray-700">
//               Book Advisor ana sayfasına hoş geldiniz! Burada en son eklenen kitapları,
//               popüler kategorileri ve size özel önerileri bulabilirsiniz.
//             </p>
//             {/* Buraya ana sayfa içeriğiniz gelecek */}
//             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {/* Örnek Kartlar */}
//               {[1, 2, 3, 4, 5, 6].map(i => (
//                 <div key={i} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
//                   <div className="w-full h-40 bg-gray-300 rounded-md mb-3 animate-pulse"></div> {/* Resim placeholder */}
//                   <h3 className="text-lg font-semibold text-red-600 mb-1">Örnek Kitap Adı {i}</h3>
//                   <p className="text-sm text-gray-500 mb-2">Yazar Adı</p>
//                   <p className="text-xs text-gray-600">Kısa bir kitap açıklaması veya tanıtımı burada yer alabilir.</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
// src/pages/HomePage.js

// src/pages/HomePage.js

// ... (diğer importlar ve ikonlar önceki gibi) ...

// Örnek Kitap Verileri (Daha güvenilir olabilecek URL'lerle güncellendi)
// src/pages/HomePage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // AuthContext yolunuzu doğrulayın
import Header from '../components/Header'; // Header bileşenini import edin
import toast from 'react-hot-toast';

// Sidebar ve Diğer İkonlar
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>;
const AccountIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const BookOpenSidebarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ImagePlaceholderIcon = () => <svg className="w-12 h-12 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;


// Örnek Kitap Verileri (Güncellenmiş Resim URL'leri ile)
const sampleBooks = [
  { id: 1, title: 'Thunmanhandiya', author: 'Mahagamasekara', imageUrl: 'https://via.placeholder.com/300x450/FFACC7/000000?Text=Thunmanhandiya', specialOffer: true },
  { id: 2, title: 'Gamperaliya', author: 'Martin Wickramasinghe', imageUrl: 'https://via.placeholder.com/300x450/ACD1AF/000000?Text=Gamperaliya', specialOffer: false },
  { id: 3, title: 'Nectar in a Sieve', author: 'Kamala Markandaya', imageUrl: 'https://via.placeholder.com/300x450/ACACFF/000000?Text=Nectar+in+a+Sieve', specialOffer: true },
  { id: 4, title: 'Adaraneeya Victoria', author: 'Mohan Raj Madawala', imageUrl: 'https://via.placeholder.com/300x450/FFFACD/000000?Text=Adaraneeya+Victoria', specialOffer: false },
  { id: 5, title: 'Ulysses', author: 'James Joyce', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/UlyssesCover.jpg/330px-UlyssesCover.jpg', specialOffer: true },
  { id: 6, title: 'To Kill a Mockingbird', author: 'Harper Lee', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg/330px-To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg', specialOffer: false },
];


export default function HomePage() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [heroSearchTerm, setHeroSearchTerm] = useState('');

  const handleLogoutFromSidebar = async () => {
    try {
      await logout();
      toast.success('Başarıyla çıkış yapıldı!');
      navigate('/login');
    } catch (error) {
      toast.error('Çıkış yapılamadı.');
      console.error("Logout error:", error);
    }
  };

  const sidebarLinks = [
    { name: 'Anasayfa', path: '/', icon: <HomeIcon /> },
    { name: 'Kategoriler', path: '/categories', icon: <CategoryIcon /> },
    { name: 'Favori Kitaplar', path: '/favorites', icon: <HeartIcon /> },
    { name: 'Okuduğum Kitaplar', path: '/read-books', icon: <BookOpenSidebarIcon /> },
    { name: 'En Çok Okunanlar', path: '/popular-books', icon: <TrendingUpIcon /> },
    { name: 'Şu Anda Okuduklarım', path: '/currently-reading', icon: <ClockIcon /> },
  ];

  if (currentUser) {
    sidebarLinks.push({ name: 'Account', path: '/account', icon: <AccountIcon /> });
  }

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearchTerm)}`);
      setHeroSearchTerm('');
    }
  };

  const handleImageError = (e) => {
    const placeholderDiv = e.target.nextSibling;
    if (e.target.style.display !== 'none') { // Çift tetiklenmeyi önle
        e.target.style.display = 'none'; // Resmi gizle
        if (placeholderDiv && placeholderDiv.classList.contains('image-placeholder')) {
            placeholderDiv.style.display = 'flex'; // Placeholder'ı göster
        }
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Mevcut Header'ınız */}
      <div className="flex flex-1 pt-16"> {/* Header yüksekliği kadar padding-top (genellikle h-16 -> 4rem -> pt-16) */}
        
        {/* Sol Sidebar */}
        <aside className="w-64 bg-white p-4 shadow-md space-y-1.5 hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto flex-shrink-0 z-30">
          <nav>
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-150"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            {currentUser && (
               <button
                onClick={handleLogoutFromSidebar}
                className="w-full flex items-center mt-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-150"
              >
                <LogoutIcon />
                Logout
              </button>
            )}
          </nav>
        </aside>

        {/* Ana İçerik Alanı */}
        <main className="flex-1 bg-gray-50 overflow-y-auto md:ml-64">
          
          {/* Hero Bölümü */}
          <section 
            className="relative bg-gray-800 text-white text-center overflow-hidden"
            style={{ 
                background: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.85)), url('https://images.pexels.com/photos/1106468/pexels-photo-1106468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
                backgroundSize: 'cover',
                backgroundPosition: 'center center'
            }}
          >
            <div className="relative z-10 py-20 md:py-28 px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight" style={{ color: '#FBBF24' }}> 
                The Book Lover's Dreamland Awaits!
              </h1>
              <p className="mt-6 max-w-xl mx-auto text-lg sm:text-xl text-gray-300">
                Welcome to the ultimate book lover's paradise! Join our community and contribute to the ever-evolving library of stories...
              </p>
              <form onSubmit={handleHeroSearch} className="mt-10 max-w-md sm:max-w-lg mx-auto flex rounded-lg shadow-lg">
                <input
                  type="search"
                  value={heroSearchTerm}
                  onChange={(e) => setHeroSearchTerm(e.target.value)}
                  placeholder="Search a Book"
                  className="flex-grow block w-full px-5 py-3.5 text-gray-900 placeholder-gray-500 bg-white border-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 sm:text-sm"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3.5 border border-transparent text-sm font-semibold rounded-r-lg text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                >
                  Search
                </button>
              </form>
            </div>
          </section>

          {/* Öne Çıkan Kitaplar Bölümü */}
          <section className="bg-white py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
                Our Best Picks
              </h2>
              <div className="overflow-x-auto pb-8 -mb-8 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thumb-rounded-full">
                <div className="flex space-x-6 w-max px-2 py-2">
                  {sampleBooks.map((book) => (
                    <div key={book.id} className="group w-56 sm:w-60 bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 flex-shrink-0 border border-gray-200">
                      <div className="relative h-72 sm:h-80 bg-gray-100 flex items-center justify-center">
                        <img 
                            src={book.imageUrl} 
                            alt={book.title} 
                            className="max-w-full max-h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                            onError={handleImageError} // Güncellenmiş onError handler
                        />
                        {/* Resim yüklenemezse gösterilecek placeholder */}
                        <div className="image-placeholder absolute inset-0 flex-col items-center justify-center text-gray-400 text-sm bg-gray-200 p-2" style={{display: 'none'}}>
                           <ImagePlaceholderIcon /> {/* İkonu buraya taşıdık */}
                           Image Not Found
                        </div>

                        {book.specialOffer && (
                          <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm z-10">
                            SPECIAL
                          </span>
                        )}
                        <button className="absolute top-2.5 right-2.5 bg-yellow-400 text-gray-900 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-yellow-300 z-10">
                          <ShoppingCartIcon />
                        </button>
                      </div>
                      <div className="p-3 text-center">
                        <h3 className="text-sm font-semibold text-gray-700 truncate h-10 flex items-center justify-center">{book.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-12 space-x-2.5">
                  <button className="w-2 h-2 bg-gray-300 rounded-full focus:outline-none hover:bg-gray-400"></button>
                  <button className="w-2 h-2 bg-yellow-400 rounded-full focus:outline-none"></button>
                  <button className="w-2 h-2 bg-gray-300 rounded-full focus:outline-none hover:bg-gray-400"></button>
              </div>
            </div>
          </section>
          
          <footer className="py-10 text-center text-gray-500 text-sm bg-gray-100 border-t border-gray-200">
            © {new Date().getFullYear()} Book Advisor. Tüm hakları saklıdır.
          </footer>
        </main>
      </div>
    </div>
  );
}