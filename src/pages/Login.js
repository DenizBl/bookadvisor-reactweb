import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';

// BookIcon bileşeni
const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 mr-2 inline-block"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.253v11.494m0 0a8.485 8.485 0 0011.023 0M12 17.747a8.485 8.485 0 01-11.023 0M12 6.253c1.693 0 3.304.54 4.622 1.514C17.94 8.728 19.25 9.9 20 11.253m-16 0c.75-1.353 2.06-2.525 3.378-3.486C8.696 6.792 10.307 6.253 12 6.253zM3 12a9 9 0 1118 0 9 9 0 01-18 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 14v-2" />
  </svg>
);

// Email ikonu
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

// Kilit ikonu
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookAnimationData, setBookAnimationData] = useState(null);
  const [readingAnimationData, setReadingAnimationData] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Lottie animasyonlarını yükle
  useEffect(() => {
    const loadAnimations = async () => {
      try {
        // Kitap animasyonu
        const bookResponse = await fetch(
          'https://lottie.host/299c206f-733c-41d0-ae42-e93472443cec/YmqVDAOaF3.json',
        );
        const bookData = await bookResponse.json();
        setBookAnimationData(bookData);

        // Okuma animasyonu
        const readingResponse = await fetch(
          'https://assets9.lottiefiles.com/packages/lf20_1pxqjqps.json',
        );
        const readingData = await readingResponse.json();
        setReadingAnimationData(readingData);
      } catch (error) {
        console.error('Animasyon yüklenirken hata oluştu:', error);
      }
    };

    loadAnimations();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      return toast.error('Lütfen email ve şifrenizi girin!');
    }

    try {
      setLoading(true);
      const { user } = await login(email, password);

      // Firebase Realtime Database'den kullanıcı rolünü al
      const { ref, get } = await import('firebase/database');
      const { database } = await import('../firebase/config');
      const userRef = ref(database, 'users/' + user.uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const role = userData.role;

        toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');

        // Role'e göre yönlendirme
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
        navigate('/');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        toast.error('Email veya şifre hatalı.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Geçersiz email formatı.');
      } else {
        toast.error('Giriş başarısız. Lütfen tekrar deneyin.');
      }
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Logo Container */}
        <div className="text-center">
          {/* Kitap Animasyonu */}
          <div className="flex justify-center mb-6">
            {bookAnimationData ? (
              <Lottie
                animationData={bookAnimationData}
                loop={true}
                autoplay={true}
                style={{ width: 150, height: 150 }}
              />
            ) : (
              <div className="w-36 h-36 flex items-center justify-center">
                <BookIcon />
              </div>
            )}
          </div>

          {/* Logo Text */}
          <div className="mb-8">
            <h1
              className="text-5xl font-bold text-white mb-2"
              style={{
                letterSpacing: '2px',
                textShadow: '2px 2px 10px rgba(0, 0, 0, 0.75)',
              }}
            >
              BookAdvisor
            </h1>
            <p
              className="text-lg text-white italic opacity-90"
              style={{
                textShadow: '1px 1px 5px rgba(0, 0, 0, 0.75)',
              }}
            >
              Kitap Dünyasına Hoş Geldiniz
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div
          className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-2xl"
          style={{
            backdropFilter: 'blur(10px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Form Header */}
          <div className="text-center mb-6">
            {/* Okuma Animasyonu */}
            <div className="flex justify-center mb-4">
              {readingAnimationData ? (
                <Lottie
                  animationData={readingAnimationData}
                  loop={true}
                  autoplay={true}
                  style={{ width: 80, height: 80 }}
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center">
                  <BookIcon />
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Hesabınıza Giriş Yapın
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    placeholder="Email adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Şifre
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    placeholder="Şifreniz"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Giriş yapılıyor...
                  </div>
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </div>

            {/* Link to Register */}
            <div className="text-center">
              <Link
                to="/register"
                className="font-medium text-red-700 hover:text-red-600 transition-colors duration-200"
                style={{ letterSpacing: '0.3px' }}
              >
                Hesabınız yok mu? Kayıt olun
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}