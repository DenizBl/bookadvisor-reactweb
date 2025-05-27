import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createUser } from '../services/userService';
import toast from 'react-hot-toast';

// Basit bir kitap ikonu (SVG olarak)
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
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 14v-2" /> {/* Sayfa kenarları */}
  </svg>
);

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      return toast.error('Lütfen tüm alanları doldurun!');
    }
    if (password.length < 6) {
      return toast.error('Şifre en az 6 karakter olmalıdır!');
    }

    try {
      setLoading(true);
      const { user } = await signup(email, password);

      const userRole = isAdmin ? 'admin' : 'member';

      // Create user in Realtime Database
      await createUser(
        firstName,
        lastName,
        email,
        user.uid,
        userRole
      );

      toast.success('Kayıt başarılı! Yönlendiriliyorsunuz...');
      
      // Role'e göre yönlendirme
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Bu e-posta adresi zaten kayıtlı.');
      } else {
        toast.error('Kayıt başarısız: ' + error.message);
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* BookAdvisor Logo/Başlık */}
        <div className="text-center">
          <button
            type="button"
            className="inline-flex items-center justify-center px-8 py-3 mb-8 border border-transparent text-xl font-bold rounded-lg text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={() => navigate('/')} // Ana sayfaya gitmesi için
          >
            <BookIcon />
            BookAdvisor
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Input alanları için container */}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                First name
              </label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Adınız"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Soyadınız"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Şifreniz"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Admin Olarak Kaydol Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Admin Olarak Kaydol</span>
            <button
              type="button"
              onClick={() => setIsAdmin(!isAdmin)}
              className={`${
                isAdmin ? 'bg-red-600' : 'bg-gray-200'
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              role="switch"
              aria-checked={isAdmin}
            >
              <span className="sr-only">Admin olarak kaydol</span>
              <span
                aria-hidden="true"
                className={`${
                  isAdmin ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {loading ? 'Kayıt yapılıyor...' : 'Sign up'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
              Switch to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}