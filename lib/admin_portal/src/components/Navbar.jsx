// // lib/admin_portal/src/components/Navbar.jsx
// import { useState, useEffect } from 'react';
// import { Menu, X, Recycle } from 'lucide-react';

// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const navLinks = [
//     { name: 'Home', href: '#home' },
//     { name: 'About', href: '#about' },
//     { name: 'Features', href: '#features' },
//     { name: 'Our Team', href: '#team' },
//     { name: 'Contact', href: '#contact' },
//   ];

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <Recycle className="w-6 h-6 text-green-600" />
//             <span className="text-xl font-bold text-gray-800">
//               Eco<span className="text-green-600">Volunteer</span>
//             </span>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navLinks.map((link) => (
//               <a
//                 key={link.name}
//                 href={link.href}
//                 className="text-gray-700 hover:text-green-600 transition-colors"
//               >
//                 {link.name}
//               </a>
//             ))}
//           </div>

//           {/* Account Button */}
//           <div className="hidden md:block">
//             <a
//               href="/admin/login"
//               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition"
//             >
//               Account
//             </a>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden text-gray-700"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           >
//             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden bg-white py-4 px-4 space-y-2">
//             {navLinks.map((link) => (
//               <a
//                 key={link.name}
//                 href={link.href}
//                 className="block py-2 text-gray-700 hover:text-green-600"
//               >
//                 {link.name}
//               </a>
//             ))}
//             <a
//               href="/admin/login"
//               className="block bg-green-600 text-white px-4 py-2 rounded-md text-center mt-2"
//             >
//               Account
//             </a>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;












//last
// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Menu, X, Recycle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScroll, useMotionValueEvent } from 'framer-motion';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Our Team', href: '#team' },
    { name: 'Contact', href: '#contact' },
  ];

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    },
    visible: { 
      opacity: 1,
      height: "auto",
      transition: {
        staggerChildren: 0.1,
        staggerDirection: 1
      }
    }
  };

  const mobileLinkVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white/90 backdrop-blur-sm py-4'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Recycle className="w-6 h-6 text-green-600" />
            <span className="text-xl font-bold text-gray-800">
              Eco<span className="text-green-600">Volunteer</span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-green-600 transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {link.name}
                <motion.span 
                  className="absolute left-0 bottom-0 h-0.5 bg-green-600 w-0 group-hover:w-full transition-all duration-300"
                  layoutId="nav-underline"
                />
              </motion.a>
            ))}
          </div>

          {/* Account Button */}
          <div className="hidden md:block">
            <motion.a
              href="/admin/login"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition flex items-center gap-2"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(22, 163, 74, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Account
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden overflow-hidden"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div className="py-4 px-4 space-y-2">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="block py-2 text-gray-700 hover:text-green-600"
                    variants={mobileLinkVariants}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.a
                  href="/admin/login"
                  className="block bg-green-600 text-white px-4 py-2 rounded-md text-center mt-2"
                  variants={mobileLinkVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Account
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;