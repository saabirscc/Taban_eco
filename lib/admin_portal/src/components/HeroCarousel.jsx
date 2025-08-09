// //lib/admin_portal/src/components/HeroCarousel.jsx
// import { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const HeroCarousel = () => {
//   const images = [
//     'https://i.pinimg.com/736x/3c/2b/0f/3c2b0fbc5f44ca3711fc9ecd74c77137.jpg',
//     'https://i.pinimg.com/736x/c0/e7/38/c0e7382365c60b63e724c4805f0a61fe.jpg',
//     'https://i.pinimg.com/736x/a8/ff/cd/a8ffcd40d408da63f14941204f361358.jpg',
//     'https://i.pinimg.com/736x/2d/bc/82/2dbc8247a0fc11a9b9d33a507ccf0078.jpg',
//     ' https://i.pinimg.com/736x/77/67/5b/77675b8533ae69153b6336e924bbe613.jpg',
//     'https://i.pinimg.com/1200x/d9/2a/a0/d92aa02acda2cc55627f76a2576b72c6.jpg',
//     'https://i.pinimg.com/736x/55/7b/3b/557b3b87c78cfbb0d1b7cbe9bf48b758.jpg',
//     'https://plus.unsplash.com/premium_photo-1681152790484-8c0beab3999a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 4000);

//     return () => clearInterval(timer);
//   }, [images.length]);

//   const goToPrevious = () => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   const goToNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   return (
//     <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl shadow-lg">
//       {/* Images Container */}
//       <div 
//         className="flex transition-transform duration-700 ease-in-out h-full"
//         style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//       >
//         {images.map((image, index) => (
//           <div key={index} className="min-w-full h-full">
//             <img
//               src={image}
//               alt={`Clean city initiative ${index + 1}`}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         ))}
//       </div>

//       {/* Navigation Arrows */}
//       <button
//         onClick={goToPrevious}
//         className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all"
//       >
//         <ChevronLeft className="w-6 h-6 text-white" />
//       </button>

//       <button
//         onClick={goToNext}
//         className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all"
//       >
//         <ChevronRight className="w-6 h-6 text-white" />
//       </button>

//       {/* Dots Indicator */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
//         {images.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentIndex(index)}
//             className={`w-3 h-3 rounded-full transition-all ${
//               index === currentIndex ? 'bg-white' : 'bg-white/50'
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HeroCarousel;












// //last
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const HeroCarousel = () => {
//   // Optimized image URLs with proper dimensions (adjust widths as needed)
//   const images = [
//     'https://i.pinimg.com/736x/3c/2b/0f/3c2b0fbc5f44ca3711fc9ecd74c77137.jpg?w=1200&h=675&auto=format&fit=crop',
//     'https://i.pinimg.com/736x/c0/e7/38/c0e7382365c60b63e724c4805f0a61fe.jpg?w=1200&h=675&auto=format&fit=crop',
//     'https://i.pinimg.com/736x/a8/ff/cd/a8ffcd40d408da63f14941204f361358.jpg?w=1200&h=675&auto=format&fit=crop',
//     'https://i.pinimg.com/736x/2d/bc/82/2dbc8247a0fc11a9b9d33a507ccf0078.jpg?w=1200&h=675&auto=format&fit=crop',
//     'https://i.pinimg.com/736x/77/67/5b/77675b8533ae69153b6336e924bbe613.jpg?w=1200&h=675&auto=format&fit=crop',
//     'https://i.pinimg.com/1200x/d9/2a/a0/d92aa02acda2cc55627f76a2576b72c6.jpg?w=1200&h=675&auto=format&fit=crop',
//     'https://i.pinimg.com/736x/55/7b/3b/557b3b87c78cfbb0d1b7cbe9bf48b758.jpg?w=1200&h=675&auto=format&fit=crop',
//     'https://plus.unsplash.com/premium_photo-1681152790484-8c0beab3999a?w=1200&h=675&auto=format&fit=crop'
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setDirection(1);
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 5000);

//     return () => clearInterval(timer);
//   }, [images.length]);

//   const goToPrevious = () => {
//     setDirection(-1);
//     setCurrentIndex((prevIndex) => 
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   const goToNext = () => {
//     setDirection(1);
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   // Animation variants
//   const variants = {
//     enter: (direction) => ({
//       x: direction > 0 ? 1000 : -1000,
//       opacity: 0
//     }),
//     center: {
//       x: 0,
//       opacity: 1
//     },
//     exit: (direction) => ({
//       x: direction < 0 ? 1000 : -1000,
//       opacity: 0
//     })
//   };

//   return (
//     <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] xl:h-[36rem] overflow-hidden rounded-xl shadow-2xl">
//       <AnimatePresence custom={direction} initial={false}>
//         <motion.div
//           key={currentIndex}
//           custom={direction}
//           variants={variants}
//           initial="enter"
//           animate="center"
//           exit="exit"
//           transition={{
//             x: { type: "spring", stiffness: 300, damping: 30 },
//             opacity: { duration: 0.2 }
//           }}
//           className="absolute w-full h-full"
//         >
//           <img
//             src={images[currentIndex]}
//             alt={`Clean city initiative ${currentIndex + 1}`}
//             className="w-full h-full object-cover"
//             loading="eager"
//             // Add srcSet for responsive images
//             srcSet={`
//               ${images[currentIndex].replace('w=1200', 'w=400')} 400w,
//               ${images[currentIndex].replace('w=1200', 'w=800')} 800w,
//               ${images[currentIndex]} 1200w
//             `}
//             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
//           />
//         </motion.div>
//       </AnimatePresence>

//       {/* Navigation Arrows */}
//       <button
//         onClick={goToPrevious}
//         className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all z-10"
//         aria-label="Previous image"
//       >
//         <motion.div
//           whileHover={{ scale: 1.2 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <ChevronLeft className="w-6 h-6 text-white" />
//         </motion.div>
//       </button>

//       <button
//         onClick={goToNext}
//         className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all z-10"
//         aria-label="Next image"
//       >
//         <motion.div
//           whileHover={{ scale: 1.2 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <ChevronRight className="w-6 h-6 text-white" />
//         </motion.div>
//       </button>

//       {/* Dots Indicator */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
//         {images.map((_, index) => (
//           <motion.button
//             key={index}
//             onClick={() => {
//               setDirection(index > currentIndex ? 1 : -1);
//               setCurrentIndex(index);
//             }}
//             className={`w-3 h-3 rounded-full transition-all ${
//               index === currentIndex ? 'bg-white' : 'bg-white/50'
//             }`}
//             whileHover={{ scale: 1.2 }}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HeroCarousel;