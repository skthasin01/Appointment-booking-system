import { createBrowserRouter, Outlet } from 'react-router';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import GuestOnly from '../components/common/GuestOnly';
import RequireAuth from '../components/common/RequireAuth';
import RouteError from '../components/common/RouteError';
import DashboardLayout from '../components/dashboard/DashboardLayout';

// Public
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import NotFound from '../pages/public/NotFound';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Doctors (live API)
import Doctors from '../pages/doctors/Doctors';
import DoctorDetails from '../pages/doctors/DoctorDetails';

// Booking & patient pages (live API)
import Booking from '../pages/booking/Booking';
import BookingConfirmation from '../pages/booking/BookingConfirmation';
import MyAppointments from '../pages/user/MyAppointments';
import Profile from '../pages/user/Profile';
import ChangePassword from '../pages/user/ChangePassword';

// Doctor dashboard
import Dashboard from '../pages/doctor/Dashboard';
import Appointments from '../pages/doctor/Appointments';
import ManageSchedule from '../pages/doctor/ManageSchedule';
import Services from '../pages/doctor/Services';

// Admin dashboard (live API)
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminAppointments from '../pages/admin/AdminAppointments';
import AdminDoctors from '../pages/admin/AdminDoctors';
import AdminDoctorEdit from '../pages/admin/AdminDoctorEdit';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminReviews from '../pages/admin/AdminReviews';

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
        path: '/book/:doctorId',
        element: (
          <RequireAuth roles={['patient']}>
            <Booking />
          </RequireAuth>
        ),
      },
      {
        path: '/booking/success',
        element: (
          <RequireAuth roles={['patient']}>
            <BookingConfirmation />
          </RequireAuth>
        ),
      },
      {
        path: '/my-appointments',
        element: (
          <RequireAuth>
            <MyAppointments />
          </RequireAuth>
        ),
      },
      {
        path: '/profile',
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        ),
      },
      {
        path: '/change-password',
        element: (
          <RequireAuth>
            <ChangePassword />
          </RequireAuth>
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
    element: (
      <RequireAuth roles={['doctor']}>
        <DashboardLayout />
      </RequireAuth>
    ),
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
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'profile/change-password',
        element: <ChangePassword />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <RequireAuth roles={['admin']}>
        <DashboardLayout />
      </RequireAuth>
    ),
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'appointments',
        element: <AdminAppointments />,
      },
      {
        path: 'doctors',
        element: <AdminDoctors />,
      },
      {
        path: 'doctors/:doctorId',
        element: <AdminDoctorEdit />,
      },
      {
        path: 'users',
        element: <AdminUsers />,
      },
      {
        path: 'reviews',
        element: <AdminReviews />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'profile/change-password',
        element: <ChangePassword />,
      },
    ],
  },
]);

export default router;
