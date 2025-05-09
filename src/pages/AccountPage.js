import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // AuthContext yolunuzu doğrulayın
import toast from 'react-hot-toast';

// İkonlar (SVG olarak)
const UserIcon = ({ className = "h-5 w-5 text-gray-500" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const MailIcon = ({ className = "h-5 w-5 text-gray-500" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const PencilIcon = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

export default function AccountPage() {
  const { currentUser, logout } = useAuth(); // getUserData gibi bir fonksiyonunuz varsa onu da ekleyebilirsiniz.
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    firstName: 'Deniz', // Görseldeki placeholder
    lastName: 'Bal',    // Görseldeki placeholder
    email: '',
    about: 'Elf',       // Görseldeki placeholder
    // Gerçek profil resmi URL'sini Firestore'dan veya başka bir kaynaktan almalısınız.
    profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&w=128&h=128&fit=crop&q=80' 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      // Gerçek uygulamada, kullanıcı verilerini Firestore'dan veya API'den çekmelisiniz.
      // Örneğin:
      // const fetchUserData = async () => {
      //   try {
      //     const userDoc = await db.collection('users').doc(currentUser.uid).get();
      //     if (userDoc.exists) {
      //       const data = userDoc.data();
      //       setUserData({
      //         firstName: data.firstName || 'N/A',
      //         lastName: data.lastName || 'N/A',
      //         email: currentUser.email,
      //         about: data.about || 'N/A',
      //         profilePictureUrl: data.profilePictureUrl || userData.profilePictureUrl,
      //       });
      //     }
      //   } catch (error) {
      //     toast.error("Kullanıcı bilgileri yüklenemedi.");
      //     console.error("Kullanıcı bilgileri çekme hatası:", error);
      //   } finally {
      //     setLoading(false);
      //   }
      // };
      // fetchUserData();

      // Şimdilik currentUser.email'i kullanalım ve diğerlerini placeholder olarak bırakalım
      setUserData(prev => ({ ...prev, email: currentUser.email }));
      setLoading(false);
    } else {
      // Kullanıcı yoksa giriş sayfasına yönlendir
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Başarıyla çıkış yapıldı!');
      navigate('/login');
    } catch (error) {
      toast.error('Çıkış yapılamadı.');
      console.error("Çıkış hatası:", error);
    }
  };

  const handleEditProfile = () => {
    // Profil düzenleme sayfasına yönlendirme veya modal açma
    toast('Profil düzenleme özelliği henüz eklenmedi.', { icon: 'ℹ️' });
    // navigate('/edit-profile'); 
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Hesap bilgileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 p-10 bg-white shadow-xl rounded-2xl">
        <h2 className="text-center text-4xl font-bold text-gray-800 mb-10">
          Account
        </h2>

        <div className="relative w-36 h-36 mx-auto mb-8">
          <img
            src={userData.profilePictureUrl}
            alt="Profile"
            className="rounded-full w-full h-full object-cover border-4 border-white shadow-lg"
          />
          <button
            onClick={handleEditProfile}
            className="absolute bottom-1 right-1 bg-gray-700 hover:bg-gray-800 text-white p-2.5 rounded-full shadow-md transition-transform duration-150 ease-in-out hover:scale-110"
            aria-label="Profili Düzenle"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First name
            </label>
            <div className="mt-1 flex items-center w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
              <UserIcon className="h-5 w-5 text-gray-500 mr-3" />
              <span>{userData.firstName}</span>
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last name
            </label>
            <div className="mt-1 flex items-center w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
              <UserIcon className="h-5 w-5 text-gray-500 mr-3" />
              <span>{userData.lastName}</span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="mt-1 flex items-center w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
              <MailIcon className="h-5 w-5 text-gray-500 mr-3" />
              <span>{userData.email}</span>
            </div>
          </div>

          {/* About */}
          <div>
            <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>
            <div className="mt-1 flex items-center w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
              <UserIcon className="h-5 w-5 text-gray-500 mr-3" />
              <span>{userData.about}</span>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-xl text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-colors duration-150"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}