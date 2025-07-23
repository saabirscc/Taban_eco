import { useState } from 'react';
import Header  from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer  from '../components/Footer';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={()=>setSidebarOpen(s => !s)} />

        {/* page body */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
