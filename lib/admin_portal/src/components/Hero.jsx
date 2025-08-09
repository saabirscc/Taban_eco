// // src/components/Hero.jsx
// import React, { useEffect, useState, useMemo } from 'react';
// import HeroCarousel from './HeroCarousel';
// // import { Smartphone } from 'lucide-react'; // optional

// const API_BASE =
//   process.env.REACT_APP_API_BASE_URL ||
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   'http://localhost:5000/api';

// /**
//  * @typedef {{ _id:string }} Volunteer
//  * @typedef {{ _id:string, status:string, volunteers:Volunteer[] }} Cleanup
//  */

// const HeroSection = () => {
//   const [cleanups, setCleanups] = useState([]);   
//   const [loading, setLoading]   = useState(true);
//   const [error, setError]       = useState(null); 

//   useEffect(() => {
//     const ctrl = new AbortController();
//     (async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch(`${API_BASE}/public/cleanups`, {
//           signal: ctrl.signal,
//         });

//         if (!res.ok) {
//           const j = await res.json().catch(() => ({}));
//           throw new Error(j.msg || `Request failed (${res.status})`);
//         }

//         const data = await res.json();
//         setCleanups(Array.isArray(data) ? data : []);
//       } catch (e) {
//         if (e.name !== 'AbortError') setError(e.message || 'Network error');
//       } finally {
//         setLoading(false);
//       }
//     })();
//     return () => ctrl.abort();
//   }, []);

//   const { completedCount, uniqueVolunteers } = useMemo(() => {
//     const completed = cleanups.filter(c => c.status === 'completed').length;
//     const vols = new Set();
//     cleanups.forEach(c => c.volunteers?.forEach(v => vols.add(v._id)));
//     return { completedCount: completed, uniqueVolunteers: vols.size };
//   }, [cleanups]);

//   return (
    
//     <section id="home" className="pt-20 pb-24 bg-gradient-to-r from-green-500 to-green-600 text-white">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row items-center gap-12">
//           {/* Left Content */}
//           <div className="md:w-1/2 space-y-6">
//             <h1 className="text-4xl md:text-5xl font-bold leading-tight">
//               Clean Your City,
//               <br />
//               <span className="text-yellow-300">Save Your Future</span>
//             </h1>

//             <p className="text-lg text-white/90 leading-relaxed">
//               Join our community-driven platform to transform your neighborhood.
//               Together, we can create cleaner, healthier cities for everyone.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4">
//               {/* <button className="flex items-center justify-center gap-2 bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all">
//                 <Smartphone size={20} />
//                 Use Application
//               </button> */}
//               <button
//                 className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 py-3 rounded-lg font-semibold transition-all"
//                 onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
//               >
//                 Learn More
//               </button>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-3 gap-4 pt-8">
//               <StatBox label="Cleanups Done" value={loading ? '…' : String(completedCount)} />
//               <StatBox label="Volunteers"    value={loading ? '…' : String(uniqueVolunteers)} />
//               {/* <StatBox label="Requests" value={loading ? '…' : String(cleanups.length)} /> */}
//             </div>

//             {error && (
//               <p className="text-sm text-red-100 bg-red-500/30 rounded-md px-3 py-2 mt-4">
//                 {error}
//               </p>
//             )}
//           </div>

//           {/* Right Content - Image Carousel */}
//           <div className="md:w-1/2">
//             <HeroCarousel />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;

// function StatBox({ value, label }) {
//   return (
//     <div className="text-center">
//       <div className="text-3xl font-bold text-yellow-300">{value}</div>
//       <div className="text-white/80">{label}</div>
//     </div>
//   );
// }








//last
// import React, { useEffect, useState, useMemo } from 'react';
// import HeroCarousel from './HeroCarousel';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ArrowDown } from 'lucide-react';

// const API_BASE =
//   process.env.REACT_APP_API_BASE_URL ||
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   'http://localhost:5000/api';

// const HeroSection = () => {
//   const [cleanups, setCleanups] = useState([]);   
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); 

//   useEffect(() => {
//     const ctrl = new AbortController();
//     (async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch(`${API_BASE}/public/cleanups`, {
//           signal: ctrl.signal,
//         });

//         if (!res.ok) {
//           const j = await res.json().catch(() => ({}));
//           throw new Error(j.msg || `Request failed (${res.status})`);
//         }

//         const data = await res.json();
//         setCleanups(Array.isArray(data) ? data : []);
//       } catch (e) {
//         if (e.name !== 'AbortError') setError(e.message || 'Network error');
//       } finally {
//         setLoading(false);
//       }
//     })();
//     return () => ctrl.abort();
//   }, []);

//   const { completedCount, uniqueVolunteers } = useMemo(() => {
//     const completed = cleanups.filter(c => c.status === 'completed').length;
//     const vols = new Set();
//     cleanups.forEach(c => c.volunteers?.forEach(v => vols.add(v._id)));
//     return { completedCount: completed, uniqueVolunteers: vols.size };
//   }, [cleanups]);

//   const statVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 10
//       }
//     }
//   };

//   return (
//     <section id="home" className="pt-32 pb-24 bg-gradient-to-r from-green-500 to-green-600 text-white overflow-hidden">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row items-center gap-12">
//           {/* Left Content */}
//           <div className="md:w-1/2 space-y-8">
//             <motion.h1 
//               className="text-5xl md:text-6xl font-bold leading-tight"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               Clean Your City,
//               <br />
//               <motion.span 
//                 className="text-yellow-300 inline-block"
//                 initial={{ scale: 0.9 }}
//                 animate={{ scale: 1 }}
//                 transition={{ 
//                   repeat: Infinity,
//                   repeatType: "reverse",
//                   duration: 2
//                 }}
//               >
//                 Save Your Future
//               </motion.span>
//             </motion.h1>

//             <motion.p 
//               className="text-xl text-white/90 leading-relaxed"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2, duration: 0.6 }}
//             >
//               Join our community-driven platform to transform your neighborhood.
//               Together, we can create cleaner, healthier cities for everyone.
//             </motion.p>

//             <motion.div 
//               className="flex flex-col sm:flex-row gap-4"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//             >
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2"
//                 onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
//               >
//                 Learn More
//                 <motion.span
//                   animate={{ y: [0, 5, 0] }}
//                   transition={{ repeat: Infinity, duration: 2 }}
//                 >
//                   <ArrowDown size={20} />
//                 </motion.span>
//               </motion.button>
//             </motion.div>

//             {/* Stats */}
//             <motion.div 
//               className="grid grid-cols-2 gap-8 pt-12"
//               initial="hidden"
//               animate="visible"
//               variants={{
//                 visible: {
//                   transition: {
//                     staggerChildren: 0.2
//                   }
//                 }
//               }}
//             >
//               <motion.div 
//                 className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
//                 variants={statVariants}
//               >
//                 <div className="text-5xl font-bold text-yellow-300 mb-2">
//                   {loading ? '...' : completedCount}
//                 </div>
//                 <div className="text-lg text-white/80">Cleanups Done</div>
//               </motion.div>

//               <motion.div 
//                 className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
//                 variants={statVariants}
//               >
//                 <div className="text-5xl font-bold text-yellow-300 mb-2">
//                   {loading ? '...' : uniqueVolunteers}
//                 </div>
//                 <div className="text-lg text-white/80">Volunteers</div>
//               </motion.div>
//             </motion.div>

//             {error && (
//               <motion.p 
//                 className="text-sm text-red-100 bg-red-500/30 rounded-md px-3 py-2 mt-4"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 {error}
//               </motion.p>
//             )}
//           </div>

//           {/* Right Content - Image Carousel */}
//           <div className="md:w-1/2">
//             <HeroCarousel />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;



















//last animated
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Sparkles, Users, Trash2, CheckCircle } from 'lucide-react';

const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:5000/api';

// Array of background image URLs
const BACKGROUND_IMAGES = [
  'https://i.pinimg.com/1200x/7d/94/75/7d947553ac48b96e1bb0373a4126a3a4.jpg',
  'https://i.pinimg.com/736x/0a/7d/05/0a7d059ee1fefb2bdb7939e33639f932.jpg',
  'https://i.pinimg.com/736x/59/ab/59/59ab59ef0c061d53b8eb83e94396f601.jpg'
];

const HeroSection = () => {
  const [cleanups, setCleanups] = useState([]);   
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Rotate background images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        (prevIndex + 1) % BACKGROUND_IMAGES.length
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/public/cleanups`, {
          signal: ctrl.signal,
        });

        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.msg || `Request failed (${res.status})`);
        }

        const data = await res.json();
        setCleanups(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || 'Network error');
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  const { completedCount, uniqueVolunteers } = useMemo(() => {
    const completed = cleanups.filter(c => c.status === 'completed').length;
    const vols = new Set();
    cleanups.forEach(c => c.volunteers?.forEach(v => vols.add(v._id)));
    return { completedCount: completed, uniqueVolunteers: vols.size };
  }, [cleanups]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatVariants = {
    float: {
      y: ["0%", "-10%", "0%"],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const bgVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <section 
      id="home" 
      className="relative pt-32 pb-24 text-white overflow-hidden min-h-screen flex items-center"
      style={{
        background: 'linear-gradient(to right, rgba(5, 150, 105, 0.8), rgba(6, 95, 70, 0.8))'
      }}
    >
      {/* Background images with fade transition */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentBgIndex}
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${BACKGROUND_IMAGES[currentBgIndex]})`
          }}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.5 }}
        >
          {/* Overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </motion.div>
      </AnimatePresence>

      {/* Animated decorative elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-green-500/20 blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl animate-float-delay"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-yellow-300/20 blur-3xl animate-float"></div>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Content */}
          <div className="max-w-4xl space-y-8">
            <motion.div variants={itemVariants}>
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <span className="text-white">Clean Your City,</span>
                <br />
                <motion.span 
                  className="text-green-300 inline-block relative"
                  variants={pulseVariants}
                  animate="pulse"
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                >
                  Save Your Future
                  <AnimatePresence>
                    {isHovered && (
                      <motion.span
                        className="absolute -top-4 -right-6"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <Sparkles className="text-green-300 w-6 h-6" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
              </motion.h1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.p 
                className="text-xl sm:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Join our community-driven platform to transform your neighborhood. 
                Together, we can create cleaner, healthier cities for everyone.
              </motion.p>
            </motion.div>

            <motion.div 
              className="flex justify-center gap-4 pt-4"
              variants={itemVariants}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold transition-all flex items-center gap-2 group"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              >
                <span className="relative z-10">Learn More</span>
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="relative z-10"
                >
                  <ArrowDown size={20} />
                </motion.span>
              </motion.button>
            </motion.div>

            {/* Stats - Now as button-like elements */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-8"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              <motion.button
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 flex flex-col items-center transition-all"
                whileHover={{ y: -3 }}
                variants={{
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
                }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-300 w-6 h-6" />
                  <span className="text-3xl font-bold text-white">
                    {loading ? (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        ...
                      </motion.span>
                    ) : (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring" }}
                      >
                        {completedCount}
                      </motion.span>
                    )}
                  </span>
                </div>
                <div className="text-lg font-medium text-green-200 mt-1">Successful Cleanups</div>
              </motion.button>

              <motion.button
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 flex flex-col items-center transition-all"
                whileHover={{ y: -3 }}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { 
                    y: 0, 
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 10,
                      delay: 0.2
                    }
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <Users className="text-green-300 w-6 h-6" />
                  <span className="text-3xl font-bold text-white">
                    {loading ? (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        ...
                      </motion.span>
                    ) : (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring" }}
                      >
                        {uniqueVolunteers}
                      </motion.span>
                    )}
                  </span>
                </div>
                <div className="text-lg font-medium text-green-200 mt-1">Active Volunteers</div>
              </motion.button>
            </motion.div>

            {error && (
              <motion.p 
                className="text-sm text-red-100 bg-red-500/30 rounded-md px-3 py-2 mt-4 inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {error}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Floating scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ArrowDown className="text-white w-8 h-8" />
      </motion.div>
    </section>
  );
};

export default HeroSection;