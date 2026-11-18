import { createBrowserRouter, Outlet } from 'react-router';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import GuestOnly from '../components/common/GuestOnly';
import RouteError from '../components/common/RouteError';
import DashboardLayout from '../components/dashboard/DashboardLayout';

import Home from '../pages/public/Home';
import Doctors from '../pages/public/Doctors';
import DoctorDetails from '../pages/public/DoctorDetails';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import NotFound from '../pages/public/NotFound';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import Dashboard from '../pages/doctor/Dashboard';
import Appointments from '../pages/doctor/Appointments';
import ManageSchedule from '../pages/doctor/ManageSchedule';
import Services from '../pages/doctor/Services';

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
    errorElement: <RouteError />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/doctors',
        element: <Doctors />,
      },
      {
        path: '/doctors/:id',
        element: <DoctorDetails />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/login',
        element: (
          <GuestOnly>
            <Login />
          </GuestOnly>
        ),
      },
      {
        path: '/register',
        element: (
          <GuestOnly>
            <Register />
          </GuestOnly>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/doctor',
    element: <DashboardLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
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
]);

export default router;
