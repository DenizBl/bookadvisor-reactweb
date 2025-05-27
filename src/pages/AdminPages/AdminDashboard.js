import React, { useState, useEffect } from 'react';
import { database } from '../../firebase/config';
import { ref, get } from 'firebase/database';
import { Link } from 'react-router-dom';

// İkonlar
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3" />
  </svg>
);

const AdminsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const BooksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const RecentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    memberUsers: 0,
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersList = Object.keys(usersData).map(key => ({
            id: key,
            ...usersData[key]
          }));

          const adminUsers = usersList.filter(user => user.role === 'admin');
          const memberUsers = usersList.filter(user => user.role === 'member');
          
          // Son 5 kullanıcıyı tarihe göre sırala
          const recentUsers = usersList
            .sort((a, b) => new Date(b.signUpDate) - new Date(a.signUpDate))
            .slice(0, 5);

          setStats({
            totalUsers: usersList.length,
            adminUsers: adminUsers.length,
            memberUsers: memberUsers.length,
            recentUsers
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, linkTo }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`text-${color}-600`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {linkTo && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link to={linkTo} className={`font-medium text-${color}-700 hover:text-${color}-900`}>
              Detayları görüntüle
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Kontrol Paneli</h1>
        <p className="text-gray-600">BookAdvisor uygulamasının genel durumunu burada görüntüleyebilirsiniz.</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Toplam Kullanıcı"
          value={stats.totalUsers}
          icon={<UsersIcon />}
          color="blue"
          linkTo="/admin/users"
        />
        <StatCard
          title="Admin Kullanıcılar"
          value={stats.adminUsers}
          icon={<AdminsIcon />}
          color="red"
          linkTo="/admin/users"
        />
        <StatCard
          title="Üye Kullanıcılar"
          value={stats.memberUsers}
          icon={<UsersIcon />}
          color="green"
          linkTo="/admin/users"
        />
        <StatCard
          title="Aktif İşlemler"
          value="0"
          icon={<RecentIcon />}
          color="purple"
        />
      </div>

      {/* Hızlı İşlemler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Hızlı İşlemler</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <Link
                to="/admin/users"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <UsersIcon />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Kullanıcı Yönetimi</div>
                  <div className="text-sm text-gray-500">Kullanıcıları görüntüle ve yönet</div>
                </div>
              </Link>
              <Link
                to="/admin/books"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <BooksIcon />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Kitap Yönetimi</div>
                  <div className="text-sm text-gray-500">Kitapları görüntüle ve yönet</div>
                </div>
              </Link>
              <Link
                to="/admin/add-book"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Yeni Kitap Ekle</div>
                  <div className="text-sm text-gray-500">Sisteme yeni kitap ekle</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Son Kullanıcılar */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Son Kayıt Olan Kullanıcılar</h3>
          </div>
          <div className="p-6">
            {stats.recentUsers.length === 0 ? (
              <p className="text-gray-500">Henüz kullanıcı bulunmuyor</p>
            ) : (
              <div className="space-y-3">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                        {user.role === 'admin' ? <AdminsIcon /> : <UsersIcon />}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Member'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link
                to="/admin/users"
                className="text-sm font-medium text-blue-600 hover:text-blue-900"
              >
                Tüm kullanıcıları görüntüle →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 