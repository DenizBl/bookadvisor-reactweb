import React from 'react';
import { Link } from 'react-router-dom';
import { categoriesData } from '../contexts/categoriesData';
import Header from '../components/Header';

export default function CategoriesPage() {
  // Category-specific solid colors for Spotify-like design
  const categoryColors = [
    '#9147ff', // Purple
    '#b068e9', // Light Purple
    '#1e3a8a', // Navy
    '#b91c1c', // Red
    '#4f46e5', // Blue
    '#ec4899', // Pink
    '#7e22ce', // Deep Purple
    '#0ea5e9', // Light Blue
    '#7c3aed', // Violet
    '#059669', // Teal
    '#d946ef', // Magenta
    '#f59e0b', // Amber
  ];

  // Book-related GIFs (local assets)
  const bookGifs = [
    require('../assets/bookGif/reading-book.gif'),
    require('../assets/bookGif/6e38fbf26233906084c728a5680119c8.gif'),
    require('../assets/bookGif/sleep-dog-wear-eyeglasses-reading-book-clqv4u56biv21ys8.gif'),
    require('../assets/bookGif/pride-and-prejudice-keira-knightley.gif'),
    require('../assets/bookGif/booklover13.gif'),
    require('../assets/bookGif/153f1ca5-7e27-4c94-be8a-562982b5f444_480x370.gif'),
    require('../assets/bookGif/reading-read.gif'),
    require('../assets/bookGif/655989980sherlock-holmes-reading-book-animated-gif.gif'),
  ];

  // Mock image URLs for different categories
  const getCategoryImage = (category) => {
    const categoryMap = {
      'Kurgu': 'https://koctas-img.mncdn.com/mnpadding/600/600/ffffff/productimages/5000106538/5000106538_1_MC/8881253154866_1688731515740.jpg',
      'Kurgu Dışı': 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bm9uZmljdGlvbiUyMGJvb2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Çocuk Kurgu': 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpbGRyZW4ncyUyMGZpY3Rpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Çocuk Kurgu Dışı': 'https://images.unsplash.com/photo-1543421236-910f42454098?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpbGRyZW4ncyUyMGVkdWNhdGlvbmFsJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'Biyografi & Otobiyografi': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Bilim': 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Tarih': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGlzdG9yeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'Din': 'https://dinsosyolojisi.com.tr/wp-content/uploads/2020/03/din-ve-toplum-iliskisi.jpg',
      'Sosyal Bilimler': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNvbW11bml0eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'Teknoloji & Mühendislik': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'Tıp': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaWNhbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'Sanat': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'İşletme & Ekonomi': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnVzaW5lc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Bilgisayarlar': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Yemek Kitapları': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29va2luZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'El Sanatları & Hobiler': 'https://www.agri.edu.tr/upload/meslekyuksekokuludetay263/Resimler/1124201845725PM1.JPG',
      'Tiyatro': 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Eğitim': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'Aile & İlişkiler': 'https://uspe.blob.core.windows.net/web/Articles/1200_b167ad81-b6fd-4fa1-aeea-6f52e71aa823.jpeg',
      'Yabancı Dil Eğitimi': 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFuZ3VhZ2UlMjBsZWFybmluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'Oyunlar': 'https://turktarihmuzesiveparki.com/wp-content/uploads/2022/01/karagoz-ve-hacivat-gosterisi.jpeg',
      'Bahçecilik': 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FyZGVuaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'Sağlık & Fitness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGVhbHRoJTIwYW5kJTIwZml0bmVzc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'Ev & Yaşam': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Mizah': 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnVubnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Hukuk': 'https://img.pixers.pics/pho_wat(s3:700/FO/61/90/66/57/700_FO61906657_ca7d122b05a00a862a645f1f4030a793.jpg,700,467,cms:2018/10/5bd1b6b8d04b8_220x50-watermark.png,over,480,417,jpg)/duvar-resimleri-hukuk-ve-adalet-kavrami-ahsap-tokmak.jpg.jpg',
      'Edebi Eleştiri': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGlicmFyeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'Matematik': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWF0aGVtYXRpY3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Müzik': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Doğa': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'Sahne Sanatları': 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyZm9ybWluZyUyMGFydHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Evcil Hayvanlar': 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGV0c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'Felsefe': 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Şiir': 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Siyaset Bilimi': 'https://images.pexels.com/photos/7722329/pexels-photo-7722329.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Psikoloji': 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHN5Y2hvbG9neXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'Başvuru Kaynakları': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVmZXJlbmNlJTIwYm9va3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Spor & Rekreasyon': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BvcnRzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'Ders Çalışma Yardımcıları': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3R1ZHlpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      'Seyahat': 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhdmVsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'Gerçek Suç Hikayeleri': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGV0ZWN0aXZlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    };
    
    // Return default image if category not found
    return categoryMap[category] || 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png';
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="rounded-lg shadow-lg px-4 py-2 mb-6" style={{background: '#b91c1c'}}>
          <h1 className="text-2xl font-bold text-white">
            Kategoriler
            <span className="text-sm font-normal text-red-100 ml-2">
              {categoriesData.length} kategori
            </span>
          </h1>
        </div>

        {/* Book GIFs Horizontal Scroll */}
        <div className="mb-8">
          <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
            {bookGifs.map((gif, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-64 h-48 rounded-lg overflow-hidden shadow-lg"
              >
                <img 
                  src={gif}
                  alt={`Book GIF ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categoriesData
            .filter(category => category.displayNameTR !== 'Çocuk Kurgu Dışı')
            .map((category, index) => {
              const backgroundColor = categoryColors[index % categoryColors.length];
              const imageUrl = getCategoryImage(category.displayNameTR);
              
              return (
                <Link
                  to={`/category/${encodeURIComponent(category.slug)}`}
                  key={category.slug}
                  className="group relative overflow-hidden rounded-xl shadow-lg 
                           transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105"
                  style={{ 
                    backgroundColor,
                    minHeight: '125px'
                  }}
                >
                  <div className="p-4 h-full flex flex-col justify-start">
                    <span className="font-bold text-sm text-white 
                                   drop-shadow-lg max-w-[70%] leading-tight">
                      {category.displayNameTR}
                    </span>
                  </div>
                  <img 
                    src={imageUrl}
                    alt={category.displayNameTR}
                    className="absolute bottom-[-5px] right-[-5px] w-16 h-16 
                             object-cover rounded-xl opacity-90 
                             transform rotate-[25deg] transition-transform duration-300
                             group-hover:scale-110"
                  />
                </Link>
              );
            })}
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

