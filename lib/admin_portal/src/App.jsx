// // src/App.jsx
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';

// import RequireAuth    from './routes/RequireAuth';
// import AdminLayout    from './layouts/AdminLayout';

// // admin pages
// import Dashboard      from './pages/admin/Dashboard';
// import Users          from './pages/admin/Users';
// import CleanupList    from './pages/admin/CleanupList';
// import CleanupForm    from './pages/admin/CleanupForm';
// import Reports        from './pages/admin/Reports';
// import Education      from './pages/admin/Education';
// import AdminLogin     from './pages/admin/Login';

// export default function App() {
//   return (
//     <Routes>
//       {/* Public: Admin sign-in */}
//       <Route path="/admin/login" element={<AdminLogin />} />

//       {/* Private: everything that needs a valid JWT */}
//       <Route element={<RequireAuth />}>
//         <Route element={<AdminLayout />}>
//           <Route path="/admin"             element={<Dashboard   />} />
//           <Route path="/admin/users"       element={<Users       />} />
//           <Route path="/admin/cleanups"    element={<CleanupList />} />
//           <Route path="/admin/cleanup/:id" element={<CleanupForm />} />
          
//           {/* New: Reporting section */}
//           <Route path="/admin/reports" element={<Reports />} />

//           {/* New: Education section */}
//           <Route path="/admin/education" element={<Education />} />
//         </Route>
//       </Route>

//       {/* Anything else → login */}
//       <Route path="*" element={<Navigate to="/admin/login" replace />} />
//     </Routes>
//   );
// }



 // update
// // src/App.jsx

// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import AOS from 'aos';
// import 'aos/dist/aos.css';

// // Components
// import Navbar from './components/Navbar';
// import Hero from './components/Hero';
// import About from './pages/admin/About';
// import Features from './pages/admin/Features';
// import Team from './pages/admin/Team';
// import Contact from './pages/admin/Contact';
// import Footer from './components/Footer';
// import BackToTop from './components/BackToTop';

// // Admin components
// import AdminLayout from './layouts/AdminLayout';
// import RequireAuth from './routes/RequireAuth';
// import Dashboard from './pages/admin/Dashboard';
// import Users from './pages/admin/Users';
// import CleanupList from './pages/admin/CleanupList';
// import CleanupForm from './pages/admin/CleanupForm';
// import Reports from './pages/admin/Reports';
// import Education from './pages/admin/Education';
// import AdminLogin from './pages/admin/Login';

// // Public landing layout
// const MainLayout = () => {
//   return (
//     <div className="font-poppins">
//       <Navbar />
//       <main>
//         <Hero />
//         <About />
//         <Features />
//         <Team />
//         <Contact />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default function App() {
//   const [showBackToTop, setShowBackToTop] = useState(false);

//   useEffect(() => {
//     AOS.init({
//       duration: 800,
//       easing: 'ease-in-out',
//       once: true,
//     });

//     const handleScroll = () => {
//       setShowBackToTop(window.scrollY > 300);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <>
//       <Routes>
//         {/* ✅ Public Landing Page */}
//         <Route path="/" element={<MainLayout />} />

//         {/* ✅ Admin Login (Public Route) */}
//         <Route path="/admin/login" element={<AdminLogin />} />

//         {/* ✅ Private Admin Routes */}
//         <Route element={<RequireAuth />}>
//           <Route element={<AdminLayout />}>
//             <Route path="/admin" element={<Dashboard />} />
//             <Route path="/admin/users" element={<Users />} />
//             <Route path="/admin/cleanups" element={<CleanupList />} />
//             <Route path="/admin/cleanup/:id" element={<CleanupForm />} />
//             <Route path="/admin/reports" element={<Reports />} />
//             <Route path="/admin/education" element={<Education />} />
//           </Route>
//         </Route>

//         {/* ✅ Fallback Route */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>

//       {/* Back to top button */}
//       {showBackToTop && <BackToTop />}
//     </>
//   );
// }




//sabirin updated the code
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
//import { ThemeProvider } from './contexts/ThemeContext'; // ✅ Added ThemeProvider


// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './pages/admin/About';
import Features from './pages/admin/Features';
import Team from './pages/admin/Team';
import Contact from './pages/admin/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import HowItWorks from './pages/HowItWorks.'; // ✅ NEW - Import HowItWorks


// Admin components
import AdminLayout from './layouts/AdminLayout';
import RequireAuth from './routes/RequireAuth';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import CleanupList from './pages/admin/CleanupList';
import CleanupForm from './pages/admin/CleanupForm';
import Reports from './pages/admin/Reports';
import Education from './pages/admin/Education';
import AdminLogin from './pages/admin/Login';
import Charts from './pages/admin/Charts';
import Settings from './pages/admin/Settings';
import PostCleanupStory from './pages/admin/PostCleanupStory'; // ✅ NEW
import StoriesGallery from './pages/admin/StoriesGallery'; // ✅ NEW


// Public landing layout
const MainLayout = () => {
  return (
    <div className="font-poppins">
      <Navbar />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <Features />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Routes>
        {/* ✅ Public Landing Page */}
        <Route path="/" element={<MainLayout />} />

        {/* ✅ Public Stories Gallery */}
        <Route path="/stories" element={<StoriesGallery />} /> {/* ✅ Added */}

        {/* ✅ Admin Login (Public Route) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ✅ Private Admin Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/cleanups" element={<CleanupList />} />
            <Route path="/admin/cleanup/:id" element={<CleanupForm />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/education" element={<Education />} />
            <Route path="/admin/charts" element={<Charts />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/post-cleanup-story" element={<PostCleanupStory />} /> {/* ✅ NEW */}
          </Route>
        </Route>

        {/* ✅ Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Back to top button */}
      {showBackToTop && <BackToTop />}
    </>
  );
}
