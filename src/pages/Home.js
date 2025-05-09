
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
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import toast from 'react-hot-toast';

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
  {
    id: 3,
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1603741832i/54120408.jpg',
    description: 'A magnificent new novel from the Nobel laureate Kazuo Ishiguro.',
    rating: 4.3,
    category: 'Literary Fiction'
  },
  {
    id: 4,
    title: 'The Four Winds',
    author: 'Kristin Hannah',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg',
    description: 'A powerful American epic about love and heroism and hope.',
    rating: 4.6,
    category: 'Historical Fiction'
  },
  {
    id: 5,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg',
    description: 'A portrait of the Jazz Age in all of its decadence and excess.',
    rating: 4.7,
    category: 'Modern Classics'
  },
  {
    id: 6,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg',
    description: 'A classic of modern American literature that explores racial injustice and moral growth.',
    rating: 4.8,
    category: 'Modern Classics'
  },
  {
    id: 7,
    title: '1984',
    author: 'George Orwell',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg',
    description: 'A dystopian social science fiction novel and cautionary tale.',
    rating: 4.6,
    category: 'Modern Classics'
  },
  {
    id: 8,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg',
    description: 'A classic coming-of-age story that has captivated readers for generations.',
    rating: 4.5,
    category: 'Modern Classics'
  }
];

// Import the category icons
const RocketIcon = ({ className = "w-12 h-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a12.024 12.024 0 004.46-4.013S18.07 3 15.59 3c-1.74 0-3.03.75-3.88 1.53F11.28 5.26 10.06 7.5 7.94 9.02M15.59 14.37a6 6 0 01-5.84 7.38m5.84-2.56l2.56-2.56" />
  </svg>
);

const MagnifyingGlassIcon = ({ className = "w-12 h-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const WandIcon = ({ className = "w-12 h-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.965 3.171a1.003 1.003 0 00-1.417-.003L4.585 9.41a1.001 1.001 0 00-.002 1.416l8.963 8.963a1 1 0 001.414 0l6.963-6.963a1 1 0 000-1.414l-8.96-8.962zM12 7.5l1.5 1.5M10.5 9l1.5 1.5m3-3l1.5 1.5m-7.5 3l1.5 1.5M18 6l1.5-1.5M21 3l-1.5 1.5M6 18l-1.5 1.5M3 21l1.5-1.5" />
  </svg>
);

const BookOpenIcon = ({ className = "w-12 h-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const UserIcon = ({ className = "w-12 h-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const GlobeAltIcon = ({ className = "w-12 h-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const StarIcon = ({ className = "w-12 h-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.418a.562.562 0 01.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.82.61l-4.725-3.248a.563.563 0 00-.65.0l-4.725 3.248a.562.562 0 01-.82-.61l1.285-5.385a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988h5.418a.563.563 0 00.475-.31L11.48 3.5z" />
  </svg>
);

// Update the categories data
const categoriesData = [
  { name: 'Romance', slug: 'romance', Icon: HeartIcon, iconColor: 'text-red-500' },
  { name: 'Science Fiction', slug: 'science-fiction', Icon: RocketIcon, iconColor: 'text-blue-500' },
  { name: 'Mystery', slug: 'mystery', Icon: MagnifyingGlassIcon, iconColor: 'text-yellow-600' },
  { name: 'Fantasy', slug: 'fantasy', Icon: WandIcon, iconColor: 'text-purple-500' },
  { name: 'History', slug: 'history', Icon: BookOpenIcon, iconColor: 'text-orange-500' },
  { name: 'Biography', slug: 'biography', Icon: UserIcon, iconColor: 'text-green-500' },
  { name: 'World Classics', slug: 'world-classics', Icon: GlobeAltIcon, iconColor: 'text-teal-500' },
  { name: 'Essential 100', slug: 'essential-100', Icon: StarIcon, iconColor: 'text-amber-500' },
];

export default function HomePage() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
      <div className="flex flex-1 pt-16">
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
                <h2 className="text-xl font-bold text-gray-800 mb-4">Navigation</h2>
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
          <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
                    <p className="text-gray-500 text-sm mb-4">{book.description}</p>
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

          {/* Categories Section */}
          <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
                <Link to="/categories" className="text-red-600 hover:text-red-700 font-medium">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {categoriesData.map((category) => (
                  <Link
                    to={`/category/${category.slug}`}
                    key={category.slug}
                    className="group bg-white rounded-xl shadow-lg border border-amber-300 hover:border-amber-500 
                             p-4 sm:p-6 flex flex-col items-center justify-center text-center 
                             transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105"
                    style={{ minHeight: '160px' }}
                  >
                    <category.Icon className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 transition-transform duration-300 group-hover:scale-110 ${category.iconColor || 'text-gray-700'}`} />
                    <span className="font-semibold text-sm sm:text-base text-gray-700 group-hover:text-amber-700">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
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


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext'; // AuthContext yolunuzu doğrulayın
// import Header from '../components/Header'; // Header bileşenini import edin
// import toast from 'react-hot-toast';

// // Sidebar ve Diğer İkonlar
// const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
// const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>;
// const AccountIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
// const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
// const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
// const BookOpenSidebarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
// const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
// const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
// const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
// const ImagePlaceholderIcon = () => <svg className="w-12 h-12 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;


// // Örnek Kitap Verileri (Güncellenmiş Resim URL'leri ile)
// const sampleBooks = [
//   { id: 1, title: 'Thunmanhandiya', author: 'Mahagamasekara', imageUrl: 'https://via.placeholder.com/300x450/FFACC7/000000?Text=Thunmanhandiya', specialOffer: true },
//   { id: 2, title: 'Gamperaliya', author: 'Martin Wickramasinghe', imageUrl: 'https://via.placeholder.com/300x450/ACD1AF/000000?Text=Gamperaliya', specialOffer: false },
//   { id: 3, title: 'Nectar in a Sieve', author: 'Kamala Markandaya', imageUrl: 'https://via.placeholder.com/300x450/ACACFF/000000?Text=Nectar+in+a+Sieve', specialOffer: true },
//   { id: 4, title: 'Adaraneeya Victoria', author: 'Mohan Raj Madawala', imageUrl: 'https://via.placeholder.com/300x450/FFFACD/000000?Text=Adaraneeya+Victoria', specialOffer: false },
//   { id: 5, title: 'Ulysses', author: 'James Joyce', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/UlyssesCover.jpg/330px-UlyssesCover.jpg', specialOffer: true },
//   { id: 6, title: 'To Kill a Mockingbird', author: 'Harper Lee', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg/330px-To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg', specialOffer: false },
// ];


// export default function HomePage() {
//   const { logout, currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [heroSearchTerm, setHeroSearchTerm] = useState('');

//   const handleLogoutFromSidebar = async () => {
//     try {
//       await logout();
//       toast.success('Başarıyla çıkış yapıldı!');
//       navigate('/login');
//     } catch (error) {
//       toast.error('Çıkış yapılamadı.');
//       console.error("Logout error:", error);
//     }
//   };

//   const sidebarLinks = [
//     { name: 'Anasayfa', path: '/', icon: <HomeIcon /> },
//     { name: 'Kategoriler', path: '/categories', icon: <CategoryIcon /> },
//     { name: 'Favori Kitaplar', path: '/favorites', icon: <HeartIcon /> },
//     { name: 'Okuduğum Kitaplar', path: '/read-books', icon: <BookOpenSidebarIcon /> },
//     { name: 'En Çok Okunanlar', path: '/popular-books', icon: <TrendingUpIcon /> },
//     { name: 'Şu Anda Okuduklarım', path: '/currently-reading', icon: <ClockIcon /> },
//   ];

//   if (currentUser) {
//     sidebarLinks.push({ name: 'Account', path: '/account', icon: <AccountIcon /> });
//   }

//   const handleHeroSearch = (e) => {
//     e.preventDefault();
//     if (heroSearchTerm.trim()) {
//       navigate(`/search?q=${encodeURIComponent(heroSearchTerm)}`);
//       setHeroSearchTerm('');
//     }
//   };

//   const handleImageError = (e) => {
//     const placeholderDiv = e.target.nextSibling;
//     if (e.target.style.display !== 'none') { // Çift tetiklenmeyi önle
//         e.target.style.display = 'none'; // Resmi gizle
//         if (placeholderDiv && placeholderDiv.classList.contains('image-placeholder')) {
//             placeholderDiv.style.display = 'flex'; // Placeholder'ı göster
//         }
//     }
//   };


//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header /> {/* Mevcut Header'ınız */}
//       <div className="flex flex-1 pt-16"> {/* Header yüksekliği kadar padding-top (genellikle h-16 -> 4rem -> pt-16) */}
        
//         {/* Sol Sidebar */}
//         <aside className="w-64 bg-white p-4 shadow-md space-y-1.5 hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto flex-shrink-0 z-30">
//           <nav>
//             {sidebarLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 to={link.path}
//                 className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-150"
//               >
//                 {link.icon}
//                 {link.name}
//               </Link>
//             ))}
//             {currentUser && (
//                <button
//                 onClick={handleLogoutFromSidebar}
//                 className="w-full flex items-center mt-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-150"
//               >
//                 <LogoutIcon />
//                 Logout
//               </button>
//             )}
//           </nav>
//         </aside>

//         {/* Ana İçerik Alanı */}
//         <main className="flex-1 bg-gray-50 overflow-y-auto md:ml-64">
          
//           {/* Hero Bölümü */}
//           <section 
//             className="relative bg-gray-800 text-white text-center overflow-hidden"
//             style={{ 
//                 background: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.85)), url('https://images.pexels.com/photos/1106468/pexels-photo-1106468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center center'
//             }}
//           >
//             <div className="relative z-10 py-20 md:py-28 px-4 sm:px-6 lg:px-8">
//               <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight" style={{ color: '#FBBF24' }}> 
//                 The Book Lover's Dreamland Awaits!
//               </h1>
//               <p className="mt-6 max-w-xl mx-auto text-lg sm:text-xl text-gray-300">
//                 Welcome to the ultimate book lover's paradise! Join our community and contribute to the ever-evolving library of stories...
//               </p>
//               <form onSubmit={handleHeroSearch} className="mt-10 max-w-md sm:max-w-lg mx-auto flex rounded-lg shadow-lg">
//                 <input
//                   type="search"
//                   value={heroSearchTerm}
//                   onChange={(e) => setHeroSearchTerm(e.target.value)}
//                   placeholder="Search a Book"
//                   className="flex-grow block w-full px-5 py-3.5 text-gray-900 placeholder-gray-500 bg-white border-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 sm:text-sm"
//                 />
//                 <button
//                   type="submit"
//                   className="inline-flex items-center px-6 py-3.5 border border-transparent text-sm font-semibold rounded-r-lg text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
//                 >
//                   Search
//                 </button>
//               </form>
//             </div>
//           </section>

//           {/* Öne Çıkan Kitaplar Bölümü */}
//           <section className="bg-white py-16 sm:py-20">
//             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//               <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
//                 Our Best Picks
//               </h2>
//               <div className="overflow-x-auto pb-8 -mb-8 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thumb-rounded-full">
//                 <div className="flex space-x-6 w-max px-2 py-2">
//                   {sampleBooks.map((book) => (
//                     <div key={book.id} className="group w-56 sm:w-60 bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 flex-shrink-0 border border-gray-200">
//                       <div className="relative h-72 sm:h-80 bg-gray-100 flex items-center justify-center">
//                         <img 
//                             src={book.imageUrl} 
//                             alt={book.title} 
//                             className="max-w-full max-h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
//                             onError={handleImageError} // Güncellenmiş onError handler
//                         />
//                         {/* Resim yüklenemezse gösterilecek placeholder */}
//                         <div className="image-placeholder absolute inset-0 flex-col items-center justify-center text-gray-400 text-sm bg-gray-200 p-2" style={{display: 'none'}}>
//                            <ImagePlaceholderIcon /> {/* İkonu buraya taşıdık */}
//                            Image Not Found
//                         </div>

//                         {book.specialOffer && (
//                           <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm z-10">
//                             SPECIAL
//                           </span>
//                         )}
//                         <button className="absolute top-2.5 right-2.5 bg-yellow-400 text-gray-900 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-yellow-300 z-10">
//                           <ShoppingCartIcon />
//                         </button>
//                       </div>
//                       <div className="p-3 text-center">
//                         <h3 className="text-sm font-semibold text-gray-700 truncate h-10 flex items-center justify-center">{book.title}</h3>
//                         <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="flex justify-center mt-12 space-x-2.5">
//                   <button className="w-2 h-2 bg-gray-300 rounded-full focus:outline-none hover:bg-gray-400"></button>
//                   <button className="w-2 h-2 bg-yellow-400 rounded-full focus:outline-none"></button>
//                   <button className="w-2 h-2 bg-gray-300 rounded-full focus:outline-none hover:bg-gray-400"></button>
//               </div>
//             </div>
//           </section>
          
//           <footer className="py-10 text-center text-gray-500 text-sm bg-gray-100 border-t border-gray-200">
//             © {new Date().getFullYear()} Book Advisor. Tüm hakları saklıdır.
//           </footer>
//         </main>
//       </div>
//     </div>
//   );
// }