// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import toast from 'react-hot-toast';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   async function handleSubmit(e) {
//     e.preventDefault();
    
//     try {
//       setLoading(true);
//       await login(email, password);
//       toast.success('Giriş başarılı!');
//       navigate('/');
//     } catch (error) {
//       toast.error('Giriş başarısız: ' + error.message);
//     }
//     setLoading(false);
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Hesabınıza giriş yapın
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email-address" className="sr-only">
//                 Email adresi
//               </label>
//               <input
//                 id="email-address"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Email adresi"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Şifre
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Şifre"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
//             </button>
//           </div>

//           <div className="text-sm text-center">
//             <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
//               Hesabınız yok mu? Kayıt olun
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// } 
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // AuthContext yolunuzu doğrulayın
import toast from 'react-hot-toast';

// Register bileşeninden kopyalanan BookIcon (veya ayrı bir dosyadan import edebilirsiniz)
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
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

// Kilit ikonu
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { userRole } = useAuth(); 
  const navigate = useNavigate();




  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      return toast.error('Lütfen email ve şifrenizi girin!');
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');

      
  setTimeout(() => {
    if (userRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  }, 10);  // küçük bir gecikme ile role yüklenmesi beklenebilir

      // navigate('/'); // Ana sayfaya veya dashboard'a yönlendir
    } catch (error) {
      console.error("Giriş hatası:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Email veya şifre hatalı.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Geçersiz email formatı.');
      }
      else {
        toast.error('Giriş başarısız. Lütfen tekrar deneyin.');
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
          <div className="space-y-4"> {/* Inputlar arası boşluk için */}
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  // placeholder="E-posta adresiniz" // Görselde placeholder yok
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
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
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  // placeholder="Şifreniz" // Görselde placeholder yok
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-2"> {/* Buton ile inputlar arasına biraz boşluk */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {loading ? 'Giriş yapılıyor...' : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-center pt-2"> {/* Link ile buton arasına biraz boşluk */}
            <Link to="/register" className="font-medium text-black hover:text-red-700">
              Switch to Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}