import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('https://todo-list-backend-42a6.onrender.com');

const TaskApp = ({ setToken }) => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();

    socket.on('updateTasks', fetchTasks);
    return () => socket.off('updateTasks');
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('https://todo-list-backend-42a6.onrender.com/api/tasks', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    }
  };

  const addTask = async () => {
    if (!taskText) return;

    try {
      await axios.post(
        'http://localhost:5000/api/tasks',
        { text: taskText },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      setTaskText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      await axios.put(`https://todo-list-backend-42a6.onrender.com/api/tasks/${id}`, updatedTask, {
        headers: { Authorization: localStorage.getItem('token') },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://todo-list-backend-42a6.onrender.com/api/tasks/${id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <div className="task-app">
      <h1>To-Do List</h1>
      <button onClick={handleLogout} className="logout">Logout</button>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="New Task"
        className="task-input"
      />
      <button onClick={addTask} className="add-task">Add Task</button>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => updateTask(task._id, { ...task, completed: !task.completed })}
              className="task-checkbox"
            />
            <input
              type="text"
              value={task.text}
              onChange={(e) => updateTask(task._id, { ...task, text: e.target.value })}
              className="task-text"
            />
            <button onClick={() => deleteTask(task._id)} className="delete-task">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskApp;
