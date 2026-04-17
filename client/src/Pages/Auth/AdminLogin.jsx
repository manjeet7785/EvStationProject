import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../Context/AuthContext';
import { apiUrl } from '../../config/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl('/auth/signin'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        // Check if user is admin
        if (!data.user?.isAdmin) {
          toast.error('Only admins can access this page');
          return;
        }

        const userData = {
          email: data.user?.email || email,
          name: `${data.user?.FirstName || ''} ${data.user?.LastName || ''}`.trim() || email,
          FirstName: data.user?.FirstName,
          LastName: data.user?.LastName,
          MobileNumber: data.user?.MobileNumber,
          vehicleNumber: data.user?.vehicleNumber,
          isAdmin: data.user?.isAdmin || false
        };
        login(data.accessToken, userData);
        toast.success("Admin Login Successful!");
        navigate('/admin');
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-amber-500">Admin</span> Portal
          </h1>
          <p className="text-gray-400">Manage your EV charging network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Admin Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-500 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
          <p className="text-sm text-blue-300 text-center">
            ℹ️ This portal is restricted to authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
