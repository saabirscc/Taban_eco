/*  lib/web/contexts/AuthContext.jsx
 *  ------------------------------------------------------------
 *  ‑ Centralises auth state for the React admin portal
 *  ‑ Only keeps / accepts JWTs whose payload → user.role === 'Admin'
 *  ‑ Works in either Vite (VITE_API_URL) or CRA (REACT_APP_API_URL)
 *  ------------------------------------------------------------
 */
import React, {
  createContext, useContext, useState, useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom'; 

/* ---------- environment helper (Vite ★ CRA) ---------- */
export const API_BASE =
  // Vite: import.meta.env.VITE_API_URL
  (typeof import.meta !== 'undefined'
    && import.meta.env
    && import.meta.env.VITE_API_URL)
  // CRA / webpack: process.env.REACT_APP_API_URL
  || process.env.REACT_APP_API_URL
  // local fallback
  || 'http://localhost:5000/api';

/* ---------- tiny Base64URL → JSON decoder (no deps) --- */
function decodeJwtPayload(jwt) {
  try {
    const [, b64] = jwt.split('.');
    const norm = b64.replace(/-/g, '+').replace(/_/g, '/')
      .padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=');
    return JSON.parse(atob(norm));
  } catch {
    return {};
  }
}

/* ---------- context skeleton -------------------------- */
const AuthContext = createContext({
  token : null,
  login : async () => {},
  logout: () => {},
});

/* ====================================================== */
/*                  Provider component                     */
/* ====================================================== */
export function AuthProvider({ children }) {
  const navigate = useNavigate();

  /* 1️⃣ Initial token – keep it ONLY if the payload says Admin */
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('token');
    if (!stored) return null;
    const { user = {} } = decodeJwtPayload(stored);
    return user.role?.toLowerCase() === 'admin' ? stored : null;
  });

  /* 2️⃣ Login – call backend then gate by role */
  async function login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const { msg } = await res.json().catch(() => ({}));
      throw new Error(msg || 'Login failed');
    }

    const { token: jwt, user } = await res.json();

    if ((user?.role || '').toLowerCase() !== 'admin') {
      throw new Error('Access denied: this portal is for admins only.');
    }

    setToken(jwt);
    localStorage.setItem('token', jwt);
    navigate('/admin');            // default landing page
  }

  /* 3️⃣ Logout */
  function logout() {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/admin/login');
  }

  /* 4️⃣ If token disappears while on a protected route → bounce */
  useEffect(() => {
    const wantsAdmin = window.location.pathname.startsWith('/admin');
    if (!token && wantsAdmin && window.location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ---------- convenience hook -------------------------- */
export function useAuth() {
  return useContext(AuthContext);
}
