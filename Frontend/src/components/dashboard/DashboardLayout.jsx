import Header from "./Header";
import Sidebar from "./Sidebar";


export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0">

        <Header />

        <div className="p-5 md:p-8">
          {children}
        </div>

      </main>

    </div>
  );
}