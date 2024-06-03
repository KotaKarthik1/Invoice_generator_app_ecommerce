import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !validateEmail(email) || password.length < 6) {
      setError('Please fill in all fields correctly. Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/register', { name, email, password });
      navigate('/');
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.error || 'Registration failed. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl text-white font-semibold mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
        <div>
            <label htmlFor="name" className="block text-gray-300 text-sm">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700  text-white rounded focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700  text-white rounded focus:outline-none  text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 text-sm">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none text-sm"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-800 text-white font-bold py-2 rounded focus:outline-none"
          >
            Register
          </button>
        </form>
        <p className="mt-3 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

