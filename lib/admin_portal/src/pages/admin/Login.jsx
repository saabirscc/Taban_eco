import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';  // or Next.js router
import ecoLogo from '../../assets/images/eco_logo.png';
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const kGreen = '#3CAC44';

export default function AdminLogin() {
  const { token, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [obscure, setObscure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If already logged in, go to dashboard
  useEffect(() => {
    if (token) navigate('/admin');
  }, [token, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      // login() will redirect via AuthProvider effect
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex flex-col items-center">
          <img src={ecoLogo} alt="EcoClean logo" className="h-20 mb-6" />
          <h1 className="text-2xl font-bold" style={{ color: kGreen }}>
            Welcome back, Admin
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <div className="relative">
            <EnvelopeIcon
              className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: kGreen }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded px-11 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="relative">
            <LockClosedIcon
              className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: kGreen }}
            />
            <input
              type={obscure ? 'password' : 'text'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded px-11 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setObscure((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {obscure ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--green,theme(colors.green.600))] text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
            style={{ backgroundColor: kGreen }}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              'LOGIN AS ADMIN'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
