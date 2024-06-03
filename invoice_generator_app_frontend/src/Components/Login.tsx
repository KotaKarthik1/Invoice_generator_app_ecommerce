import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, password });
      const { token, role, id } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      login(token, role);
      navigate(role === 'admin' ? '/AdminProductList' : '/AddProduct');
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.error || 'An error occurred during login');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-white">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded focus:outline-none bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded focus:outline-none bg-gray-700 text-white"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300">
          Don't have an account? <Link to="/Register" className="text-blue-400">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
