import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../Context/AuthContext';
import { apiUrl } from '../../config/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const from = location.state?.from?.pathname || "/";
  const search = location.state?.from?.search || "";

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
        toast.success("Log in Successful!");

        navigate(from + search, { replace: true });
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Please enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg text-lg font-semibold transition duration-300 ${isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
              }`}
          >
            {isLoading ? 'Processing...' : ' Log In'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;