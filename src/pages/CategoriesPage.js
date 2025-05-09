import React from 'react';
import { Link } from 'react-router-dom';

// Yukarıdaki ikon bileşenlerini buraya import edin veya doğrudan buraya yapıştırın.
// Eğer ikonları ayrı bir dosyaya koyduysanız:
// import { HeartIcon, RocketIcon, /* ...diğer ikonlar */ } from '../components/icons'; // Örnek yol



// Örnek İkonlar (SVG)
const HeartIcon = ({ className = "w-12 h-12" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

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

const WandIcon = ({ className = "w-12 h-12" }) => ( // Basit bir sihirli değnek ikonu
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.965 3.171a1.003 1.003 0 00-1.417-.003L4.585 9.41a1.001 1.001 0 00-.002 1.416l8.963 8.963a1 1 0 001.414 0l6.963-6.963a1 1 0 000-1.414l-8.96-8.962zM12 7.5l1.5 1.5M10.5 9l1.5 1.5m3-3l1.5 1.5m-7.5 3l1.5 1.5M18 6l1.5-1.5M21 3l-1.5 1.5M6 18l-1.5 1.5M3 21l1.5-1.5" />
  </svg>
);

const BookOpenIcon = ({ className = "w-12 h-12" }) => ( // History
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const UserIcon = ({ className = "w-12 h-12" }) => ( // Biography
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const GlobeAltIcon = ({ className = "w-12 h-12" }) => ( // Dünya Klasikleri
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const StarIcon = ({ className = "w-12 h-12" }) => ( // 100 Temel Eser
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.418a.562.562 0 01.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.82.61l-4.725-3.248a.563.563 0 00-.65.0l-4.725 3.248a.562.562 0 01-.82-.61l1.285-5.385a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988h5.418a.563.563 0 00.475-.31L11.48 3.5z" />
  </svg>
);
// Kategori Verileri
const categoriesData = [
  { name: 'Romance', slug: 'romance', Icon: HeartIcon, iconColor: 'text-red-500' },
  { name: 'Science Fiction', slug: 'science-fiction', Icon: RocketIcon, iconColor: 'text-blue-500' },
  { name: 'Mystery', slug: 'mystery', Icon: MagnifyingGlassIcon, iconColor: 'text-yellow-600' },
  { name: 'Fantasy', slug: 'fantasy', Icon: WandIcon, iconColor: 'text-purple-500' },
  { name: 'History', slug: 'history', Icon: BookOpenIcon, iconColor: 'text-orange-500' },
  { name: 'Biography', slug: 'biography', Icon: UserIcon, iconColor: 'text-green-500' },
  { name: 'Dünya Klasikleri', slug: 'world-classics', Icon: GlobeAltIcon, iconColor: 'text-teal-500' },
  { name: '100 Temel Eser', slug: 'essential-100', Icon: StarIcon, iconColor: 'text-amber-500' },
  // Daha fazla kategori ekleyebilirsiniz
];



export default function CategoriesPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8"> {/* Sayfa içeriği için ana container */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
        Kategoriler
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {categoriesData.map((category) => (
          <Link
            to={`/category/${category.slug}`} // Kategori detay sayfasına yönlendirme
            key={category.slug}
            className="group bg-white rounded-xl shadow-lg border border-amber-300 hover:border-amber-500 
                       p-4 sm:p-6 flex flex-col items-center justify-center text-center 
                       transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105"
            style={{ minHeight: '160px' }} // Kartlar için minimum yükseklik
          >
            <category.Icon className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 transition-transform duration-300 group-hover:scale-110 ${category.iconColor || 'text-gray-700'}`} />
            <span className="font-semibold text-sm sm:text-base text-gray-700 group-hover:text-amber-700">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

