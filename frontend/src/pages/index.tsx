import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { username, password }, { withCredentials: true });
      if (res.status === 201) {
        navigate('/topics');
      } else {
        alert('Failed to sign in');
      }
    } catch (error) {
      alert('Failed to sign in');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-5xl w-full items-center justify-between font-mono lg:flex">
        <h1 className="text-4xl mb-8">Sign In</h1>
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
          <div className="mt-6">
            <Link to="/auth/signup">
              <span className="text-blue-500 mt-4 cursor-pointer">Don't have an account? Sign Up</span>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
