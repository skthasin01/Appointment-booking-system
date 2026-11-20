import { useState } from 'react';
import { Outlet } from 'react-router';

import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  // Mobile slide-over sidebar (always visible on large screens)
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:flex-none">
        <Sidebar />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <Sidebar onNavigate={() => setMenuOpen(false)} />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="flex-1 bg-black/40"
          />
        </div>
      )}

      <main className="min-w-0 flex-1">
        <Header onMenuClick={() => setMenuOpen(true)} />

        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
