import { createBrowserRouter, Outlet } from 'react-router';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import DashboardLayout from '../components/dashboard/DashboardLayout';

import Dashboard from '../pages/provider/Dashboard';
import Appointments from '../pages/provider/Appointments';
import ManageSchedule from '../pages/provider/ManageSchedule';
import Services from '../pages/provider/Services';

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
    {   
        path: '/', 
        element: <h1>Home Page</h1> 
    },
    { 
        path: '/providers', 
        element: <h1>Providers Page</h1> 
    },
    { 
        path: '/about', 
        element: <h1>About Page</h1> 
    },
    { 
        path: '/contact', 
        element: <h1>Contact Page</h1> 
    },
    ],
  },
  {
    path: '/provider',
    element: <DashboardLayout />,
    children: [
      { 
        path: 'dashboard', 
        element: <Dashboard /> 
    },
      { 
        path: 'appointments', 
        element: <Appointments /> 
    },
    {
        path: 'schedule', 
        element: <ManageSchedule /> 
    },
    { 
        path: 'services', 
        element: <Services /> 
    },
    ],
  },
]);

export default router;