
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // AuthContext yolunuzu doğrulayın

// Sayfalar
import LoginPage from './pages/Login'; // Login olarak adlandırılmıştı, LoginPage yapıyorum
import RegisterPage from './pages/Register'; // Register olarak adlandırılmıştı, RegisterPage yapıyorum
import HomePage from './pages/HomePage'; // Yeni HomePage'imiz
import AccountPage from './pages/AccountPage'; // Yeni AccountPage'imiz
import AdminBooks from './pages/AdminBooks';
import CategoriesPage from './pages/CategoriesPage'; // Örnek bir kategori sayfası

// Bileşenler
import Header from './components/Header'; // Header bileşenimiz

import './App.css'; // Genel stilleriniz varsa

// Protected Route component (Mevcut PrivateRoute'unuzu kullanıyoruz)
function PrivateRoute({ children, requiredRole }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    // Daha iyi bir yükleme ekranı eklenebilir
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Yükleniyor...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // İsteğe bağlı olarak bir "Yetkisiz Erişim" sayfası gösterilebilir
    toast.error('Bu sayfaya erişim yetkiniz yok.');
    return <Navigate to="/" replace />;
  }

  return children;
}

// Header'ı ve soldaki navigasyonu içerecek bir Layout bileşeni (opsiyonel ama kullanışlı)
function MainLayout() {
  // HomePage zaten kendi içinde Header ve sol navigasyonu barındırıyor.
  // Diğer sayfalar için de benzer bir yapı düşünülebilir veya bu Layout'u kullanabilirler.
  // Şimdilik Outlet ile direkt çocukları render edelim, Header'ı global tutabiliriz.
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        {/* Sol Sidebar (HomePage'den kopyalanabilir veya ayrı bir bileşen yapılabilir) */}
        {/* <aside className="w-64 bg-white p-4 shadow-lg space-y-2 hidden md:block">
           NAVIGASYON LİNKLERİ BURAYA GELECEK
        </aside> */}
        <main className="flex-1"> {/* Sidebar yoksa direkt content */}
          <Outlet /> {/* Çocuk rotaların render edileceği yer */}
        </main>
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        
        <Routes>
          {/* Herkese Açık Rotalar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Korumalı Rotalar (Header ve potansiyel sol navigasyonu içeren bir Layout ile) */}
          <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            {/* Admin rotaları da bu layout içinde olabilir veya kendi özel layout'u olabilir */}
            <Route
              path="/admin/books"
              element={
                <PrivateRoute requiredRole="admin"> {/* Double check, role is already checked by parent */}
                  <AdminBooks />
                </PrivateRoute>
              }
            />
            {/* Member routes - Örnek */}
            <Route
              path="/books"
              element={
                <div className="p-6"> {/* Basit bir sayfa için */}
                  <h1 className="text-2xl font-semibold">Kitaplar (Üye)</h1>
                  <p>Burası üyelere özel kitap listeleme sayfasıdır.</p>
                </div>
              }
            />
          </Route>
          
          {/* Eşleşmeyen rotalar için 404 sayfası veya anasayfaya yönlendirme */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;