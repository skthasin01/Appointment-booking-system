import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';

import './index.css';
import router from './routes/Routes.jsx';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
      
    </AuthProvider>
    
  </StrictMode>
);
