// src/routes/RequireAuth.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RequireAuth() {
  const { token } = useAuth();
  const location = useLocation();

  // If user is not authenticated, redirect to admin login
  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location }} // for post-login redirect, if needed
        replace
      />
    );
  }

  // Authenticated: allow access to the protected routes
  return <Outlet />;
}
