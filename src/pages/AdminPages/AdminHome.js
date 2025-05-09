// src/pages/AdminHome.js

import React from 'react';
import { Link, Outlet } from 'react-router-dom'; // Outlet, iç içe admin rotaları için
import Header from '../../components/Header'; // Admin sayfası da Header'ı kullanabilir
// Admin'e özel ikonlar eklenebilir
const BookManagementIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const UserManagementIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3" /></svg>;

export default function AdminHome() {
  const adminSidebarLinks = [
    { name: 'Kitap Yönetimi', path: '/admin/books', icon: <BookManagementIcon /> }, // Bu zaten var
    { name: 'Kullanıcı Yönetimi', path: '/admin/users', icon: <UserManagementIcon /> }, // Yeni örnek link
    // Diğer admin linkleri...
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header /> {/* Admin paneli için de Header kullanılabilir */}
      <div className="flex flex-1">
        {/* Admin Sol Sidebar */}
        <aside className="w-64 bg-gray-800 text-gray-100 p-4 space-y-2 hidden md:block">
          <div className="text-xl font-semibold mb-6 px-2">Admin Paneli</div>
          <nav>
            {adminSidebarLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center px-3 py-2.5 hover:bg-gray-700 rounded-md transition-colors duration-150"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Admin Ana İçerik Alanı */}
        <main className="flex-1 p-6">
          {/* Eğer /admin/books gibi alt rotalar varsa, Outlet buraya gelir.
              Eğer AdminHome sayfası kendi içeriğini gösteriyorsa, Outlet yerine içerik gelir.
              Mevcut /admin/books rotası ayrı bir component olduğu için, 
              burası genel bir admin karşılama sayfası olabilir.
          */}
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Kontrol Paneli</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Admin paneline hoş geldiniz. Buradan site ayarlarını ve içeriklerini yönetebilirsiniz.</p>
            {/* Buraya admin ana sayfa içeriği veya alt rotalar için <Outlet /> gelebilir */}
            {/* Örneğin, /admin/books gibi bir alt rota yoksa direkt <AdminBooks /> burada çağrılabilir */}
            {/* Veya daha genel bir yapı için Outlet kullanılır: */}
            {/* <Outlet /> */}
          </div>
        </main>
      </div>
    </div>
  );
}