import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../Context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conPass, setConPass] = useState('');
  const [mobile, setMobile] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handlerReg = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== conPass) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          FirstName: firstName,
          LastName: lastName,
          email,
          password,
          confirmPassword: conPass,
          MobileNumber: mobile,
          vehicleNumber: vehicleMake
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        if (data?.accessToken) {
          login(data.accessToken, data.user || { email, name: firstName + ' ' + lastName });
        }
        toast.success("Registration Successful! Redirecting...");
        navigate('/');
      } else {

        const errorMsg = data.error || data.message || "Registration failed";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-200 p-4'>
      <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-300'>
        <h2 className=" text-3xl font-bold text-center text-gray-800 mb-8"> Create Your Account</h2>

        <form className='space-y-6' onSubmit={handlerReg}>
          <div className='flex gap-4'>
            <div className='flex-1'>
              <label htmlFor="firstname" className='block text-sm font-medium text-gray-700 mb-1'>First Name</label>
              <input
                id='firstname'
                type="text"
                value={firstName}
                placeholder='Enter your name '
                onChange={(e) => setFirstName(e.target.value)}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150'
              />
            </div>

            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              id="mobile"
              type="tel"
              placeholder="9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              pattern="[0-9]{10}"
              maxLength={10}
              title="Please enter exactly 10 digits"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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

          <div className='flex-1'>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Please enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>

          <div className='flex-1'>
            <label htmlFor="confpass" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              id="confpass"
              type="password"
              placeholder="Repeat password"
              value={conPass}
              onChange={(e) => setConPass(e.target.value)}
              required
              minLength={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>

          <div>
            <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
            <input
              id="vehicleMake"
              type="text"
              placeholder="e.g., Tesla, Tata, MG"
              value={vehicleMake}
              onChange={(e) => setVehicleMake(e.target.value)}
              required
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
            {isLoading ? 'Processing...' : ' Register'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;