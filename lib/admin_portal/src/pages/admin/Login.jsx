// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';  // or Next.js router
// import ecoLogo from '../../assets/images/eco_logo.png';
// import {
//   EyeIcon,
//   EyeSlashIcon,
//   LockClosedIcon,
//   EnvelopeIcon,
// } from '@heroicons/react/24/outline';

// const kGreen = '#3CAC44';

// export default function AdminLogin() {
//   const { token, login } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [obscure, setObscure] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // If already logged in, go to dashboard
//   useEffect(() => {
//     if (token) navigate('/admin');
//   }, [token, navigate]);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       await login(email.trim(), password);
//       // login() will redirect via AuthProvider effect
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7, ease: 'easeInOut' }}
//         className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
//       >
//         <div className="flex flex-col items-center">
//           <img src={ecoLogo} alt="EcoClean logo" className="h-20 mb-6" />
//           <h1 className="text-2xl font-bold" style={{ color: kGreen }}>
//             Welcome back, Admin
//           </h1>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5 mt-8">
//           <div className="relative">
//             <EnvelopeIcon
//               className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2"
//               style={{ color: kGreen }}
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full border rounded px-11 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//           </div>

//           <div className="relative">
//             <LockClosedIcon
//               className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2"
//               style={{ color: kGreen }}
//             />
//             <input
//               type={obscure ? 'password' : 'text'}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full border rounded px-11 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//             <button
//               type="button"
//               onClick={() => setObscure((v) => !v)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//             >
//               {obscure ? (
//                 <EyeSlashIcon className="h-5 w-5" />
//               ) : (
//                 <EyeIcon className="h-5 w-5" />
//               )}
//             </button>
//           </div>

//           {error && <p className="text-red-600 text-sm">{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[var(--green,theme(colors.green.600))] text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
//             style={{ backgroundColor: kGreen }}
//           >
//             {loading ? (
//               <svg
//                 className="animate-spin h-5 w-5 text-white"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                   fill="none"
//                 />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                 />
//               </svg>
//             ) : (
//               'LOGIN AS ADMIN'
//             )}
//           </button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }




//sabirin updated the code

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';  // or Next.js router
// import ecoLogo from '../../assets/images/eco_logo.png'; // Your image path
// import leftImage from '../../assets/images/5.png'; // New left-side image path
// import {
//   EyeIcon,
//   EyeSlashIcon,
//   LockClosedIcon,
//   EnvelopeIcon,
// } from '@heroicons/react/24/outline';

// const kGreen = '#3CAC44';

// export default function AdminLogin() {
//   const { token, login } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [obscure, setObscure] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // If already logged in, go to dashboard
//   useEffect(() => {
//     if (token) navigate('/admin');
//   }, [token, navigate]);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       await login(email.trim(), password);
//       // login() will redirect via AuthProvider effect
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7, ease: 'easeInOut' }}
//         className="w-full max-w-4xl flex bg-white rounded-2xl shadow-xl p-8"
//       >
//         {/* Left Side Image */}
//         <div className="w-1/2 flex justify-center items-center">
//           <img
//             src={leftImage}
//             alt="EcoClean Left Image"
//             className="w-full h-auto object-cover rounded-lg"
//           />
//         </div>

//         {/* Right Side Form */}
//         <div className="w-1/2 flex flex-col items-center justify-center p-6">
//           <img src={ecoLogo} alt="EcoClean logo" className="h-20 mb-6" />
//           <h1 className="text-2xl font-bold" style={{ color: kGreen }}>
//             Welcome back, Admin
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-5 mt-8 w-full">
//             <div className="relative">
//               <EnvelopeIcon
//                 className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2"
//                 style={{ color: kGreen }}
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full border rounded px-11 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>

//             <div className="relative">
//               <LockClosedIcon
//                 className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2"
//                 style={{ color: kGreen }}
//               />
//               <input
//                 type={obscure ? 'password' : 'text'}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full border rounded px-11 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//               <button
//                 type="button"
//                 onClick={() => setObscure((v) => !v)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//               >
//                 {obscure ? (
//                   <EyeSlashIcon className="h-5 w-5" />
//                 ) : (
//                   <EyeIcon className="h-5 w-5" />
//                 )}
//               </button>
//             </div>

//             {error && <p className="text-red-600 text-sm">{error}</p>}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-[var(--green,theme(colors.green.600))] text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
//               style={{ backgroundColor: kGreen }}
//             >
//               {loading ? (
//                 <svg
//                   className="animate-spin h-5 w-5 text-white"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                     fill="none"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                   />
//                 </svg>
//               ) : (
//                 'LOGIN AS ADMIN'
//               )}
//             </button>
//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// }







//last 
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ecoLogo from '../../assets/images/eco_logo.png';
import leftImage from '../../assets/images/5.png';
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const kGreen = '#3CAC44';

export default function AdminLogin() {
  const { token, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [obscure, setObscure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) navigate('/admin');
  }, [token, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Left Side Image - Always visible */}
        <motion.div
          className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <motion.img
            src={leftImage}
            alt="EcoClean Left Image"
            className="w-full h-auto max-h-[60vh] md:max-h-none object-contain rounded-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7 }}
          />
        </motion.div>

        {/* Right Side Form */}
        <motion.div
          className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex justify-center">
            <img 
              src={ecoLogo} 
              alt="EcoClean logo" 
              className="h-16 sm:h-20 mb-6" 
            />
          </motion.div>

          <motion.h1 
            className="text-2xl sm:text-3xl font-bold text-center mb-2"
            style={{ color: kGreen }}
            variants={itemVariants}
          >
            Welcome back, Admin
          </motion.h1>

          <motion.p 
            className="text-gray-600 text-center mb-6 sm:mb-8"
            variants={itemVariants}
          >
            Sign in to manage your cleanups
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <motion.div variants={itemVariants}>
              <div className="relative">
                <EnvelopeIcon
                  className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: kGreen }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border rounded-lg px-11 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="relative">
                <LockClosedIcon
                  className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: kGreen }}
                />
                <input
                  type={obscure ? 'password' : 'text'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border rounded-lg px-11 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
                <motion.button
                  type="button"
                  onClick={() => setObscure((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  whileTap={{ scale: 0.9 }}
                >
                  {obscure ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-red-600 text-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: kGreen }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <span>LOGIN AS ADMIN</span>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}