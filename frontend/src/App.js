import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Auth from './components/Auth';
import TaskApp from './components/TaskApp';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <div className="app-container">
      {token ? <TaskApp setToken={setToken} /> : <Auth handleLogin={handleLogin} />}
    </div>
  );
}

export default App;
