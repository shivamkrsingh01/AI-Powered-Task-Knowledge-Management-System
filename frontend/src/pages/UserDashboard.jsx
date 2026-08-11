import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tasksAPI, searchAPI, documentsAPI } from '../services/api';
import TaskDetails from '../components/TaskDetails';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchDocuments();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await tasksAPI.getTasks();
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await documentsAPI.getDocuments();
      setDocuments(res.data);
    } catch (err) {
      setError('Failed to fetch documents');
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
      const res = await searchAPI.search(searchQuery, 10);
      setSearchResults(res.data.results);
      
      // Save to search history (avoid duplicates)
      if (!searchHistory.includes(searchQuery)) {
        setSearchHistory([searchQuery, ...searchHistory].slice(0, 10));
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (query) => {
    setSearchQuery(query);
    handleSearch({ preventDefault: () => {} });
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

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateTask(taskId, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update task');
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
            className="btn"
            style={{ marginRight: '10px', background: activeTab === 'tasks' ? '#0056b3' : '' }}
            onClick={() => setActiveTab('tasks')}
          >
            My Tasks
          </button>
          <button
            className="btn"
            style={{ marginRight: '10px', background: activeTab === 'documents' ? '#0056b3' : '' }}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button
            className="btn"
            style={{ marginRight: '10px', background: activeTab === 'search' ? '#0056b3' : '' }}
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
              <button className="btn" onClick={() => handleFilterTasks('in_progress')}>
                In Progress
              </button>
              <button className="btn" onClick={() => handleFilterTasks('completed')}>
                Completed
              </button>
              <button className="btn" onClick={() => handleFilterTasks('blocked')}>
                Blocked
              </button>
              <button className="btn" onClick={() => handleFilterTasks('on_hold')}>
                On Hold
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
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
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
                      <td>
                        <span className={`status-badge status-${task.status}`}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="btn"
                          style={{ padding: '5px' }}
                          value={task.status}
                          onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="blocked">Blocked</option>
                          <option value="on_hold">On Hold</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="card">
            <h3>Available Documents</h3>
            {documents.length === 0 ? (
              <p>No documents available</p>
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

            {searchHistory.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <strong>Recent Searches:</strong>
                <div style={{ marginTop: '5px' }}>
                  {searchHistory.map((query, index) => (
                    <button
                      key={index}
                      className="btn"
                      style={{ 
                        marginRight: '5px', 
                        marginBottom: '5px', 
                        padding: '5px 10px', 
                        fontSize: '12px',
                        background: '#f0f0f0'
                      }}
                      onClick={() => handleHistoryClick(query)}
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4>Results ({searchResults.length})</h4>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                  Semantic search finds relevant content even with different wording
                </p>
                {searchResults.map((result, index) => (
                  <div key={index} className="search-result" style={{ cursor: 'pointer' }}>
                    <div className="filename">{result.filename}</div>
                    <div className="score">Similarity: {(result.score * 100).toFixed(1)}%</div>
                    <div className="content" style={{ 
                      background: '#fff9c4',
                      padding: '10px',
                      borderRadius: '4px',
                      marginTop: '8px',
                      maxHeight: '150px',
                      overflow: 'auto'
                    }}>
                      {result.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchResults.length === 0 && searchQuery && !loading && (
              <p style={{ marginTop: '20px' }}>No results found. Try different keywords or upload more documents.</p>
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

export default UserDashboard;
