// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import {
  ArrowLeftOnRectangleIcon,
  UserGroupIcon,
  Squares2X2Icon,
  CheckBadgeIcon,
  ChartBarIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const kGreen = '#3CAC44';

export default function Sidebar({ open, setOpen }) {
  const { logout } = useAuth();

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-2 rounded-lg transition
     ${isActive
       ? 'bg-[rgba(60,172,68,0.12)] text-[rgba(60,172,68)] font-semibold'
       : 'text-gray-700 hover:bg-gray-100 hover:text-[rgba(60,172,68)]'
     }`;

  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 w-64 flex flex-col
        bg-gradient-to-b from-white to-green-50 border-r
        shadow-lg md:shadow-none
        transform ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        transition-transform duration-200 z-40
      `}
    >
      {/* Logo / Title */}
      <header
        className="h-20 flex items-center justify-center border-b"
        style={{ backgroundColor: kGreen }}
      >
        <h2 className="text-xl font-extrabold text-white tracking-wide">
          Admin Panel
        </h2>
      </header>

      {/* Nav Links */}
      <nav className="flex-1 py-6 space-y-1 text-sm">
        <NavLink to="/admin"          className={linkCls} onClick={() => setOpen(false)}>
          <Squares2X2Icon className="h-5 w-5" /> Dashboard
        </NavLink>
        <NavLink to="/admin/users"    className={linkCls} onClick={() => setOpen(false)}>
          <UserGroupIcon className="h-5 w-5" /> Users
        </NavLink>
        <NavLink to="/admin/cleanups" className={linkCls} onClick={() => setOpen(false)}>
          <CheckBadgeIcon className="h-5 w-5" /> Clean-ups
        </NavLink>
        <NavLink to="/admin/reports"  className={linkCls} onClick={() => setOpen(false)}>
          <ChartBarIcon className="h-5 w-5" /> Reporting
        </NavLink>
        <NavLink to="/admin/education" className={linkCls} onClick={() => setOpen(false)}>
          <BookOpenIcon className="h-5 w-5" /> Education
        </NavLink>
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="m-4 flex items-center gap-3 px-5 py-2 rounded-lg
                   text-red-600 hover:bg-red-50 transition"
      >
        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );
}
