import { Outlet } from 'react-router';

import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 min-w-0">
        <Header />

        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
