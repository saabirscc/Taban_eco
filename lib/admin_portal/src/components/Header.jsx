import { Bars3Icon } from '@heroicons/react/24/solid';
import logo from '../assets/images/eco_logo.png';
import { useLocation } from 'react-router-dom';

export default function Header({ toggleSidebar }) {
  const loc   = useLocation().pathname;
  const title =
    loc === '/admin'                 ? 'Dashboard' :
    loc.startsWith('/admin/users')   ? 'Users'     :
    loc.startsWith('/admin/cleanups')? 'Clean-ups' :
                                      '';

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-4
                       bg-[#3CAC44] text-white px-4 shadow-md">
      <button onClick={toggleSidebar} className="md:hidden">
        <Bars3Icon className="h-6 w-6" />
      </button>

      <img src={logo} alt="Eco logo" className="h-8 w-8 rounded-full bg-white p-1" />
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
