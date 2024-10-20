import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister
      ? 'https://todo-list-backend-42a6.onrender.com/api/auth/register'
      : 'https://todo-list-backend-42a6.onrender.com/api/auth/login';
      
    try {
      const { data } = await axios.post(url, { username, password });
      handleLogin(data.token);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      <p onClick={() => setIsRegister(!isRegister)} className="toggle">
        {isRegister ? 'Already have an account?' : 'Create an account'}
      </p>
    </form>
  );
};

export default Auth;
