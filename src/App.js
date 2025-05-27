import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminBooks from './pages/AdminBooks';
import Favorites from './pages/Favorites';
import FinishedBooks from './pages/FinishedBooks';
import PopularBooks from './pages/PopularBooks';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import CurrentlyReading from './pages/CurrentlyReading';
import AccountPage from './pages/AccountPage';
import AdminLayout from "./pages/AdminPages/AdminLayout" // Admin Layout
import AdminDashboard from "./pages/AdminPages/AdminDashboard" // Admin Dashboard
import AdminAddBook from "./pages/AdminPages/AdminAddBook" // Admin Kitap Ekleme Sayfası
import AdminUserManagement from "./pages/AdminPages/AdminUserManagement" // Admin Kullanıcı Yönetimi
import { SearchProvider } from './contexts/SearchContext';
import BookDetailPage from './pages/BookDetailPage';
import AIBookRecommendation from './components/AIBookRecommendation';
import './App.css';

// Protected Route component
function PrivateRoute({ children, requiredRole }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Admin kullanıcı üye sayfasına gitmeye çalışırsa admin paneline yönlendir
    if (userRole === 'admin' && requiredRole === 'member') {
      return <Navigate to="/admin" />;
    }
    // Üye kullanıcı admin sayfasına gitmeye çalışırsa ana sayfaya yönlendir
    return <Navigate to="/" />;
  }

  return children;
}

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Toaster position="top-right" />
//         <div className="min-h-screen bg-gray-100">
//           <header className="bg-white shadow">
//             <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Book Advisor
//               </h1>
//             </div>
//           </header>
//           <main>
//             <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//               <Routes>
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route 
//                   path="/" 
//                   element={
//                     <PrivateRoute>
//                       <Home />
//                     </PrivateRoute>
//                   } 
//                 />
//                 {/* Admin routes */}
//                 <Route 
//                   path="/admin/books" 
//                   element={
//                     <PrivateRoute requiredRole="admin">
//                       <AdminBooks />
//                     </PrivateRoute>
//                   } 
//                 />
//                 {/* Member routes */}
//                 <Route 
//                   path="/books" 
//                   element={
//                     <PrivateRoute>
//                       <div>Kitaplar</div>
//                     </PrivateRoute>
//                   } 
//                 />
//               </Routes>
//             </div>
//           </main>
//         </div>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App; 


function App() {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <Toaster position="top-right" />
          <div className="min-h-screen bg-gray-100">
            {/* BU HEADER KISMINI YORUMA ALIN VEYA KALDIRIN
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Book Advisor
                </h1>
              </div>
            </header>
            */}
            <main> {/* Bu main etiketi kalabilir, genel content sarmalayıcısı olarak */}
              {/* <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"> BU div'i HomePage kendi yönetecek */}
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Home /> {/* Home (HomePage) artık kendi layout'unu ve header'ını yönetecek */}
                      </PrivateRoute>
                    }
                  />
                  {/* Admin routes with nested layout */}
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute requiredRole="admin">
                        <AdminLayout />
                      </PrivateRoute>
                    }
                  >
                    {/* Nested admin routes */}
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUserManagement />} />
                    <Route path="books" element={<AdminBooks />} />
                    <Route path="add-book" element={<AdminAddBook />} />
                  </Route>
                  {/* Diğer Admin Alt Rotaları (eğer AdminHome içinde Outlet kullanılıyorsa):
                  <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminHome /></PrivateRoute>}>
                    <Route path="books" element={<AdminBooks />} />
                    <Route path="users" element={<AdminUsers />} /> // Örnek
                  </Route>
                  */}
                    {/* Member routes */}
                    <Route
                      path="/books"
                      element={
                        <PrivateRoute>
                           {/* Bu sayfa da kendi Header'ını veya ortak bir Layout'u kullanabilir */}
                          <div>Kitaplar</div>
                        </PrivateRoute>
                        
                        
                      }
                    />

  <Route
    path="/categories"
    element={
      <PrivateRoute>
        <CategoriesPage />
      </PrivateRoute>
    }
  />

  <Route
    path="/category/:slug"
    element={
      <PrivateRoute>
        <CategoryDetailPage />
      </PrivateRoute>
    }
  />

                    
                    <Route
    path="/aibook"
    element={
      <PrivateRoute>
        <AIBookRecommendation />
      </PrivateRoute>
    }
  />
   <Route
    path="/favorites"
    element={
      <PrivateRoute>
        <Favorites />
      </PrivateRoute>
    }
  />
  <Route
    path="/okuduklarim"
    element={
      <PrivateRoute>
        <FinishedBooks />
      </PrivateRoute>
    }
  />
  <Route
    path="/popular-books"
    element={
      <PrivateRoute>
        <PopularBooks />
      </PrivateRoute>
    }
  />
  <Route
    path="/currently-reading"
    element={
      <PrivateRoute>
        <CurrentlyReading />
      </PrivateRoute>
    }
  />
  <Route
    path="/account"
    element={
      <PrivateRoute>
        <AccountPage />
      </PrivateRoute>
    }

  />
  <Route path="/book/:id" element={<BookDetailPage />} />

                </Routes>
              {/* </div> */}
            </main>
          </div>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;