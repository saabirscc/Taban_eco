// import { NavLink } from 'react-router-dom';
// import {
//   ArrowLeftOnRectangleIcon,
//   UserGroupIcon,
//   Squares2X2Icon,
//   CheckBadgeIcon,
//   ChartBarIcon,
//   BookOpenIcon,
//   BellAlertIcon,
//   Cog6ToothIcon,
//   UsersIcon,
// } from '@heroicons/react/24/outline';

// import { useAuth } from '../contexts/AuthContext';

// const kGreen = '#3CAC44';

// export default function Sidebar({ open, setOpen }) {
//   const { logout } = useAuth();

//   const linkCls = ({ isActive }) =>
//     `flex items-center gap-3 px-5 py-2 rounded-lg transition
//      ${isActive
//        ? 'bg-[rgba(60,172,68,0.12)] text-[rgba(60,172,68)] font-semibold'
//        : 'text-gray-700 hover:bg-gray-100 hover:text-[rgba(60,172,68)]'
//      }`;

//   return (
//     <aside
//       className={`
//         fixed md:static inset-y-0 left-0 w-64 flex flex-col
//         bg-gradient-to-b from-white to-green-50 border-r
//         shadow-lg md:shadow-none
//         transform ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
//         transition-transform duration-200 z-40
//       `}
//     >
//       {/* Logo / Title */}
//       <header
//         className="h-20 flex items-center justify-center border-b"
//         style={{ backgroundColor: kGreen }}
//       >
//         <h2 className="text-xl font-extrabold text-white tracking-wide">
//           Admin Panel
//         </h2>
//       </header>

//       {/* Nav Links */}
//       <nav className="flex-1 py-6 space-y-1 text-sm">
//         <NavLink to="/admin" className={linkCls} onClick={() => setOpen(false)}>
//           <Squares2X2Icon className="h-5 w-5" /> Dashboard
//         </NavLink>

//         <NavLink to="/admin/users" className={linkCls} onClick={() => setOpen(false)}>
//           <UserGroupIcon className="h-5 w-5" /> Users
//         </NavLink>

//         <NavLink to="/admin/cleanups" className={linkCls} onClick={() => setOpen(false)}>
//           <CheckBadgeIcon className="h-5 w-5" /> Clean-ups
//         </NavLink>

//         {/* ✅ Corrected NavLink */}
//         <NavLink to="/admin/post-cleanup-story" className={linkCls} onClick={() => setOpen(false)}>
//           <CheckBadgeIcon className="h-5 w-5" /> Post Cleanup Story
//         </NavLink>

//         <NavLink to="/admin/education" className={linkCls} onClick={() => setOpen(false)}>
//           <BookOpenIcon className="h-5 w-5" /> Education
//         </NavLink>

//         <NavLink to="/admin/charts" className={linkCls} onClick={() => setOpen(false)}>
//           <ChartBarIcon className="h-5 w-5" /> Charts
//         </NavLink>

//         <NavLink to="/admin/reports" className={linkCls} onClick={() => setOpen(false)}>
//           <ChartBarIcon className="h-5 w-5" /> Reporting
//         </NavLink>

        

//         <NavLink to="/admin/notifications" className={linkCls} onClick={() => setOpen(false)}>
//           <BellAlertIcon className="h-5 w-5" /> Notifications
//         </NavLink>

//         <NavLink to="/admin/settings" className={linkCls} onClick={() => setOpen(false)}>
//           <Cog6ToothIcon className="h-5 w-5" /> Settings
//         </NavLink>
//       </nav>

//       {/* Logout */}
//       <button
//         onClick={logout}
//         className="m-4 flex items-center gap-3 px-5 py-2 rounded-lg
//                    text-red-600 hover:bg-red-50 transition"
//       >
//         <ArrowLeftOnRectangleIcon className="h-5 w-5" />
//         Logout
//       </button>
//     </aside>
//   );
// }








//before
// import { NavLink } from 'react-router-dom';
// import {
//   ArrowLeftOnRectangleIcon,
//   UserGroupIcon,
//   Squares2X2Icon,
//   CheckBadgeIcon,
//   ChartBarIcon,
//   BookOpenIcon,
//   BellAlertIcon,
//   Cog6ToothIcon,
//   UsersIcon,
// } from '@heroicons/react/24/outline';

// import { useAuth } from '../contexts/AuthContext';

// const kGreen = '#3CAC44';

// export default function Sidebar({ open, setOpen }) {
//   const { logout } = useAuth();

//   const linkCls = ({ isActive }) =>
//     `flex items-center gap-3 px-5 py-2 rounded-lg transition
//      ${isActive
//        ? 'bg-[rgba(60,172,68,0.12)] text-[rgba(60,172,68)] font-semibold'
//        : 'text-gray-700 hover:bg-gray-100 hover:text-[rgba(60,172,68)]'
//      }`;

//   return (
//     <aside
//       className={`fixed md:static inset-y-0 left-0 w-64 flex flex-col
//         bg-gradient-to-b from-white to-green-50 border-r
//         shadow-lg md:shadow-none
//         transform ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
//         transition-transform duration-200 z-40`}
//     >
//       {/* Logo / Title */}
//       <header
//         className="h-20 flex items-center justify-center border-b"
//         style={{ backgroundColor: kGreen }}
//       >
//         <h2 className="text-xl font-extrabold text-white tracking-wide">
//           Admin Panel
//         </h2>
//       </header>

//       {/* Nav Links */}
//       <nav className="flex-1 py-6 space-y-1 text-sm">
//         <NavLink to="/admin" className={linkCls} onClick={() => setOpen(false)}>
//           <Squares2X2Icon className="h-5 w-5" /> Dashboard
//         </NavLink>

//         <NavLink to="/admin/users" className={linkCls} onClick={() => setOpen(false)}>
//           <UserGroupIcon className="h-5 w-5" /> Users
//         </NavLink>

//         <NavLink to="/admin/cleanups" className={linkCls} onClick={() => setOpen(false)}>
//           <CheckBadgeIcon className="h-5 w-5" /> Clean-ups
//         </NavLink>

      

//         <NavLink to="/admin/education" className={linkCls} onClick={() => setOpen(false)}>
//           <BookOpenIcon className="h-5 w-5" /> Education
//         </NavLink>

//         <NavLink to="/admin/charts" className={linkCls} onClick={() => setOpen(false)}>
//           <ChartBarIcon className="h-5 w-5" /> Charts
//         </NavLink>

//         <NavLink to="/admin/reports" className={linkCls} onClick={() => setOpen(false)}>
//           <ChartBarIcon className="h-5 w-5" />  Reports & Insights
//         </NavLink>

       

//         <NavLink to="/admin/settings" className={linkCls} onClick={() => setOpen(false)}>
//           <Cog6ToothIcon className="h-5 w-5" /> Settings
//         </NavLink>
//       </nav>

//       {/* Logout */}
//       <button
//         onClick={logout}
//         className="m-4 flex items-center gap-3 px-5 py-2 rounded-lg
//                    text-red-600 hover:bg-red-50 transition"
//       >
//         <ArrowLeftOnRectangleIcon className="h-5 w-5" />
//         Logout
//       </button>
//     </aside>
//   );
// }






//last
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
  CheckBadgeIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  PresentationChartBarIcon,
  DocumentChartBarIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const kGreen = '#3CAC44';

export default function Sidebar({ open, setOpen }) {
  const { logout } = useAuth();

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3 rounded-lg transition-all text-base
     ${isActive
       ? 'bg-[rgba(60,172,68,0.12)] text-green-600 font-semibold shadow-sm'
       : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
     }`;

  const iconVariants = {
    hover: { scale: 1.1, rotate: -5 },
    active: { scale: 0.95 }
  };

  const textVariants = {
    hover: { x: 3 },
    active: { x: 0 }
  };

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 w-64 flex flex-col
        bg-gradient-to-b from-white to-green-50 border-r
        shadow-lg md:shadow-none
        transform ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        transition-transform duration-300 z-40`}
    >
      {/* Logo / Title with Close Button */}
      <motion.header
        className="h-20 flex items-center justify-between px-4 border-b relative"
        style={{ backgroundColor: kGreen }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-extrabold text-white tracking-wide">
          Admin Panel
        </h2>
        
        {/* Mobile Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-6 w-6 text-white" />
        </button>
      </motion.header>

      {/* Nav Links */}
      <nav className="flex-1 py-6 space-y-2 px-3">
        <motion.div whileHover="hover" whileTap="active">
          <NavLink to="/admin" className={linkCls} onClick={() => setOpen(false)}>
            <motion.span variants={iconVariants}>
              <Squares2X2Icon className="h-6 w-6" />
            </motion.span>
            <motion.span variants={textVariants}>Dashboard</motion.span>
          </NavLink>
        </motion.div>

        <motion.div whileHover="hover" whileTap="active">
          <NavLink to="/admin/users" className={linkCls} onClick={() => setOpen(false)}>
            <motion.span variants={iconVariants}>
              <UsersIcon className="h-6 w-6" />
            </motion.span>
            <motion.span variants={textVariants}>Users</motion.span>
          </NavLink>
        </motion.div>

        <motion.div whileHover="hover" whileTap="active">
          <NavLink to="/admin/cleanups" className={linkCls} onClick={() => setOpen(false)}>
            <motion.span variants={iconVariants}>
              <CheckBadgeIcon className="h-6 w-6" />
            </motion.span>
            <motion.span variants={textVariants}>Clean-ups</motion.span>
          </NavLink>
        </motion.div>

        <motion.div whileHover="hover" whileTap="active">
          <NavLink to="/admin/education" className={linkCls} onClick={() => setOpen(false)}>
            <motion.span variants={iconVariants}>
              <MegaphoneIcon className="h-6 w-6" />
            </motion.span>
            <motion.span variants={textVariants}>Public Awareness</motion.span>
          </NavLink>
        </motion.div>

        <motion.div whileHover="hover" whileTap="active">
          <NavLink to="/admin/charts" className={linkCls} onClick={() => setOpen(false)}>
            <motion.span variants={iconVariants}>
              <PresentationChartBarIcon className="h-6 w-6" />
            </motion.span>
            <motion.span variants={textVariants}>Charts</motion.span>
          </NavLink>
        </motion.div>

        <motion.div whileHover="hover" whileTap="active">
          <NavLink to="/admin/reports" className={linkCls} onClick={() => setOpen(false)}>
            <motion.span variants={iconVariants}>
              <DocumentChartBarIcon className="h-6 w-6" />
            </motion.span>
            <motion.span variants={textVariants}>Reports & Insights</motion.span>
          </NavLink>
        </motion.div>

        <motion.div whileHover="hover" whileTap="active">
          <NavLink to="/admin/settings" className={linkCls} onClick={() => setOpen(false)}>
            <motion.span variants={iconVariants}>
              <Cog6ToothIcon className="h-6 w-6" />
            </motion.span>
            <motion.span variants={textVariants}>Settings</motion.span>
          </NavLink>
        </motion.div>
      </nav>

      {/* Enhanced Logout Button */}
      <motion.div 
        className="px-3 pb-4 mt-auto"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-5 py-3 rounded-lg
                     bg-red-50 hover:bg-red-100 text-red-600 font-medium
                     transition-all text-base border border-red-100
                     hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <motion.span
              animate={{ x: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            </motion.span>
            <span>Logout</span>
          </div>
          <motion.span
            className="text-xs opacity-70"
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
          >
            Esc
          </motion.span>
        </button>
      </motion.div>
    </aside>
  );
}