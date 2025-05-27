import React, { useState, useEffect } from 'react';
import { database } from '../../firebase/config';
import { ref, get, update, remove } from 'firebase/database';
import toast from 'react-hot-toast';

// İkonlar
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AdminIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });

  // Kullanıcıları yükle
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersList = Object.keys(usersData).map(key => ({
            id: key,
            ...usersData[key]
          }));
          setUsers(usersList);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Kullanıcılar yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Kullanıcı düzenleme
  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      role: user.role || 'member'
    });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const userRef = ref(database, `users/${editingUser}`);
      const updateData = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        firstLast: `${editForm.firstName} ${editForm.lastName}`.toLowerCase(),
        role: editForm.role
      };

      await update(userRef, updateData);
      
      // Local state'i güncelle
      setUsers(prev => prev.map(user => 
        user.id === editingUser 
          ? { ...user, ...updateData, email: editForm.email }
          : user
      ));

      setEditingUser(null);
      toast.success('Kullanıcı başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Kullanıcı güncellenirken hata oluştu');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      firstName: '',
      lastName: '',
      email: '',
      role: ''
    });
  };

  // Kullanıcı silme
  const handleDeleteUser = async (userId, userEmail) => {
    if (window.confirm(`${userEmail} kullanıcısını silmek istediğinizden emin misiniz?`)) {
      try {
        const userRef = ref(database, `users/${userId}`);
        await remove(userRef);
        
        setUsers(prev => prev.filter(user => user.id !== userId));
        toast.success('Kullanıcı başarıyla silindi');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Kullanıcı silinirken hata oluştu');
      }
    }
  };

  // Rol değiştirme
  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, { role: newRole });
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast.success(`Kullanıcı rolü ${newRole} olarak güncellendi`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Rol güncellenirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Kullanıcı Yönetimi</h1>
        <p className="text-gray-600">Sistemdeki tüm kullanıcıları görüntüleyin ve yönetin</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <UserIcon />
          <p className="text-gray-500 mt-4">Henüz kayıtlı kullanıcı bulunmuyor</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Toplam {users.length} kullanıcı
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kayıt Tarihi
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                            className="block w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                            placeholder="Ad"
                          />
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                            className="block w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                            placeholder="Soyad"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              {user.role === 'admin' ? <AdminIcon /> : <UserIcon />}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.id ? (
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'Member'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.signUpDate ? new Date(user.signUpDate).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingUser === user.id ? (
                        <div className="space-x-2">
                          <button
                            onClick={handleUpdateUser}
                            className="text-green-600 hover:text-green-900"
                          >
                            Kaydet
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            İptal
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Düzenle"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleRoleChange(
                              user.id, 
                              user.role === 'admin' ? 'member' : 'admin'
                            )}
                            className={`${
                              user.role === 'admin' 
                                ? 'text-orange-600 hover:text-orange-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={user.role === 'admin' ? 'Member Yap' : 'Admin Yap'}
                          >
                            {user.role === 'admin' ? 'Member' : 'Admin'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="text-red-600 hover:text-red-900"
                            title="Sil"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 