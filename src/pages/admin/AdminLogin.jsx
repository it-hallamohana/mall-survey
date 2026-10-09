import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAdmin, loading, signIn } = useAuth();
  const navigate = useNavigate();

  if (loading) {
     return <div className="flex h-screen items-center justify-center bg-gray-bg" />;
  }

  if (user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await signIn(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Gagal masuk. Silakan periksa kredensial Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-bg px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-border bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center">
          <img src="/assets/pxchange-logo.png" alt="PXchange Logo" className="mb-6 h-12" />
          <h1 className="text-2xl font-bold text-charcoal">Admin Dashboard Login</h1>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-pxchange-coral">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal-light">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border border-gray-border py-2 pl-10 pr-3 text-charcoal focus:border-pxchange-teal focus:outline-none focus:ring-1 focus:ring-pxchange-teal"
                placeholder="admin@pxchange.co.id"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal-light">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-border py-2 pl-10 pr-3 text-charcoal focus:border-pxchange-teal focus:outline-none focus:ring-1 focus:ring-pxchange-teal"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-md bg-pxchange-teal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pxchange-teal-dark focus:outline-none focus:ring-2 focus:ring-pxchange-teal focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Masuk
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
