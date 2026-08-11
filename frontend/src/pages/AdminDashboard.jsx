import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tasksAPI, documentsAPI, analyticsAPI } from '../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [error, setError] = useState('');
  
  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigned_to: '',
  });
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Mock users for assignment (in real app, fetch from API)
  const users = [
    { id: 2, name: 'Regular User' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, docsRes, analyticsRes] = await Promise.all([
        tasksAPI.getTasks(),
        documentsAPI.getDocuments(),
        analyticsAPI.getAnalytics(),
      ]);
      setTasks(tasksRes.data);
      setDocuments(docsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await tasksAPI.createTask({
        ...taskForm,
        assigned_to: parseInt(taskForm.assigned_to),
      });
      setTaskForm({ title: '', description: '', assigned_to: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create task');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    setUploading(true);
    setError('');

    try {
      await documentsAPI.uploadDocument(formData);
      setSelectedFile(null);
      setUploading(false);
      fetchData();
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.detail || 'Failed to upload document');
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

  if (!analytics) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div>
      <nav className="navbar">
        <h2>Admin Dashboard</h2>
        <div>
          <span>Welcome, {user?.email}</span>
          <button onClick={handleLogout} className="btn btn-danger" style={{ marginLeft: '20px' }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        {error && <div className="error">{error}</div>}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{analytics.total_tasks}</h3>
            <p>Total Tasks</p>
          </div>
          <div className="stat-card">
            <h3>{analytics.completed_tasks}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card">
            <h3>{analytics.pending_tasks}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            className={`btn ${activeTab === 'tasks' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('tasks')}
            style={{ marginRight: '10px' }}
          >
            Tasks
          </button>
          <button
            className={`btn ${activeTab === 'documents' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('documents')}
            style={{ marginRight: '10px' }}
          >
            Documents
          </button>
          <button
            className={`btn ${activeTab === 'analytics' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'tasks' && (
          <div>
            <div className="card">
              <h3>Create Task</h3>
              <form onSubmit={handleCreateTask}>
                <label>Title</label>
                <input
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                />
                <label>Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  rows="3"
                />
                <label>Assign To</label>
                <select
                  value={taskForm.assigned_to}
                  onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                  required
                >
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </form>
            </div>

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
              <h3>Tasks</h3>
              {tasks.length === 0 ? (
                <p>No tasks found</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>{task.description || '-'}</td>
                        <td>{task.assigned_to_name || '-'}</td>
                        <td>
                          <span className={`status-badge status-${task.status}`}>
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <div className="card">
              <h3>Upload Document</h3>
              <form onSubmit={handleFileUpload}>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </form>
            </div>

            <div className="card">
              <h3>Documents</h3>
              {documents.length === 0 ? (
                <p>No documents uploaded</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Filename</th>
                      <th>Type</th>
                      <th>Uploaded By</th>
                      <th>Uploaded At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td>{doc.filename}</td>
                        <td>{doc.file_type}</td>
                        <td>{doc.uploaded_by_name || '-'}</td>
                        <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="card">
            <h3>Most Searched Queries</h3>
            {analytics.most_searched_queries.length === 0 ? (
              <p>No search data yet</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Query</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.most_searched_queries.map((item, index) => (
                    <tr key={index}>
                      <td>{item.query}</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
