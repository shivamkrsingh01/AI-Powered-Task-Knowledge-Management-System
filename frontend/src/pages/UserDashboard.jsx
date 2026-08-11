import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tasksAPI, searchAPI } from '../services/api';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await tasksAPI.getTasks();
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await searchAPI.search(searchQuery);
      setSearchResults(res.data.results);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail || 'Search failed');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await tasksAPI.updateTask(taskId, { status: 'completed' });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update task');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFilterTasks = async (status) => {
    try {
      const res = await tasksAPI.getTasks(status ? { status } : {});
      setTasks(res.data);
    } catch (err) {
      setError('Failed to filter tasks');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h2>User Dashboard</h2>
        <div>
          <span>Welcome, {user?.email}</span>
          <button onClick={handleLogout} className="btn btn-danger" style={{ marginLeft: '20px' }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        {error && <div className="error">{error}</div>}

        <div style={{ marginBottom: '20px' }}>
          <button
            className={`btn ${activeTab === 'tasks' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('tasks')}
            style={{ marginRight: '10px' }}
          >
            My Tasks
          </button>
          <button
            className={`btn ${activeTab === 'search' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search Documents
          </button>
        </div>

        {activeTab === 'tasks' && (
          <div className="card">
            <div style={{ marginBottom: '15px' }}>
              <button className="btn" onClick={() => handleFilterTasks(null)}>
                All
              </button>
              <button className="btn" onClick={() => handleFilterTasks('pending')}>
                Pending
              </button>
              <button className="btn" onClick={() => handleFilterTasks('completed')}>
                Completed
              </button>
            </div>
            <h3>My Tasks</h3>
            {tasks.length === 0 ? (
              <p>No tasks assigned to you</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.description || '-'}</td>
                      <td>
                        <span className={`status-badge status-${task.status}`}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        {task.status === 'pending' && (
                          <button
                            className="btn btn-success"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            Mark Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="card">
            <h3>Search Documents</h3>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Enter your search query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4>Results ({searchResults.length})</h4>
                {searchResults.map((result, index) => (
                  <div key={index} className="search-result">
                    <div className="filename">{result.filename}</div>
                    <div className="score">Similarity: {result.score.toFixed(3)}</div>
                    <div className="content">{result.content}</div>
                  </div>
                ))}
              </div>
            )}

            {searchResults.length === 0 && searchQuery && !loading && (
              <p style={{ marginTop: '20px' }}>No results found. Try uploading documents first.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
