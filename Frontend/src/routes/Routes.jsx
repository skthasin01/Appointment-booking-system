
import { createBrowserRouter, Navigate } from 'react-router';

import DashboardLayout from '../components/dashboard/DashboardLayout';
import Dashboard from '../pages/provider/Dashboard';
import Appointments from '../pages/provider/Appointments';
import ManageSchedule from '../pages/provider/ManageSchedule';
import Services from '../pages/provider/Services';
import AdminDashboard from '../pages/admin/AdminDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/provider/dashboard" replace />,
  },
  {
    path: '/provider',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'appointments',
        element: <Appointments />,
      },
      {
        path: 'schedule',
        element: <ManageSchedule />,
      },
      {
        path: 'services',
        element: <Services />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
]);

export default router;
