export default function Footer() {
  return (
    <footer className="h-12 flex items-center justify-center
                       bg-[#3CAC44] text-white text-sm">
      © {new Date().getFullYear()} EcoVolunteer. All rights reserved.
    </footer>
  );
}



// import { Facebook, Twitter, Linkedin, Recycle } from 'lucide-react';

// const Footer = () => {
//   return (
//     <footer className="bg-gray-800 text-white py-12">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row justify-between items-center">
//           {/* Logo and Copyright */}
//           <div className="flex items-center mb-6 md:mb-0">
//             <div className="flex items-center mr-4">
//               <Recycle className="w-6 h-6 text-green-500 mr-2" />
//               <span className="text-xl font-bold">
//                 Eco<span className="text-green-500">Volunteer</span>
//               </span>
//             </div>
//             <span className="text-gray-400 text-sm">
//               © {new Date().getFullYear()} All rights reserved
//             </span>
//           </div>

//           {/* Social Links */}
//           <div className="flex space-x-4 mb-6 md:mb-0">
//             <a 
//               href="#" 
//               className="text-gray-400 hover:text-green-500 transition-colors"
//               aria-label="Facebook"
//             >
//               <Facebook className="w-5 h-5" />
//             </a>
//             <a 
//               href="#" 
//               className="text-gray-400 hover:text-green-500 transition-colors"
//               aria-label="Twitter"
//             >
//               <Twitter className="w-5 h-5" />
//             </a>
//             <a 
//               href="#" 
//               className="text-gray-400 hover:text-green-500 transition-colors"
//               aria-label="LinkedIn"
//             >
//               <Linkedin className="w-5 h-5" />
//             </a>
//           </div>

//           {/* Quick Links */}
//           <div className="flex flex-wrap justify-center gap-4 text-sm">
//             <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
//               Privacy Policy
//             </a>
//             <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
//               Terms of Service
//             </a>
//             <a href="#contact" className="text-gray-400 hover:text-green-500 transition-colors">
//               Contact
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;