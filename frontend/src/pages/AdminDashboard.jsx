import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tasksAPI, documentsAPI, analyticsAPI } from '../services/api';
import TaskDetails from '../components/TaskDetails';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'medium',
    due_date: '',
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
        due_date: taskForm.due_date || null,
      });
      setTaskForm({ title: '', description: '', assigned_to: '', priority: 'medium', due_date: '' });
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

  const handleDownloadDocument = async (documentId, filename) => {
    try {
      const response = await documentsAPI.downloadDocument(documentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download document');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFilterTasks = async (status, priority) => {
    try {
      const params = {};
      if (status) params.status = status;
      if (priority) params.priority = priority;
      const res = await tasksAPI.getTasks(params);
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
                <label>Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <label>Due Date</label>
                <input
                  type="date"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
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
                <span style={{ marginRight: '10px', fontWeight: 'bold' }}>Status:</span>
                <button className="btn" onClick={() => handleFilterTasks(null, null)}>
                  All
                </button>
                <button className="btn" onClick={() => handleFilterTasks('pending', null)}>
                  Pending
                </button>
                <button className="btn" onClick={() => handleFilterTasks('in_progress', null)}>
                  In Progress
                </button>
                <button className="btn" onClick={() => handleFilterTasks('completed', null)}>
                  Completed
                </button>
                <button className="btn" onClick={() => handleFilterTasks('blocked', null)}>
                  Blocked
                </button>
                <button className="btn" onClick={() => handleFilterTasks('on_hold', null)}>
                  On Hold
                </button>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ marginRight: '10px', fontWeight: 'bold' }}>Priority:</span>
                <button className="btn" onClick={() => handleFilterTasks(null, null)}>
                  All
                </button>
                <button className="btn" onClick={() => handleFilterTasks(null, 'urgent')}>
                  Urgent
                </button>
                <button className="btn" onClick={() => handleFilterTasks(null, 'high')}>
                  High
                </button>
                <button className="btn" onClick={() => handleFilterTasks(null, 'medium')}>
                  Medium
                </button>
                <button className="btn" onClick={() => handleFilterTasks(null, 'low')}>
                  Low
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
                      <th>Priority</th>
                      <th>Due Date</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td>
                          <button
                            onClick={() => setSelectedTask(task)}
                            style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                          >
                            {task.title}
                          </button>
                        </td>
                        <td>{task.description || '-'}</td>
                        <td>
                          <span className={`priority-badge priority-${task.priority}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}</td>
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
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td>{doc.filename}</td>
                        <td>{doc.file_type}</td>
                        <td>{doc.uploaded_by_name || '-'}</td>
                        <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleDownloadDocument(doc.id, doc.filename)}
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            Download
                          </button>
                        </td>
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
      
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          currentUserId={user.id}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
