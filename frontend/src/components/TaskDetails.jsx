import React, { useState, useEffect } from 'react';
import { taskCommentsAPI } from '../services/api';

const TaskDetails = ({ task, currentUserId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      fetchComments();
    }
  }, [task]);

  const fetchComments = async () => {
    try {
      const res = await taskCommentsAPI.getComments(task.id);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError('');

    try {
      await taskCommentsAPI.createComment(task.id, newComment);
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await taskCommentsAPI.deleteComment(task.id, commentId);
      fetchComments();
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  if (!task) return null;

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: 'white', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Task Details</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>

        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{task.title}</h3>
          <p><strong>Description:</strong> {task.description || 'No description'}</p>
          <p><strong>Priority:</strong> <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span></p>
          <p><strong>Status:</strong> <span className={`status-badge status-${task.status}`}>{task.status}</span></p>
          <p><strong>Due Date:</strong> {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Not set'}</p>
          <p><strong>Assigned To:</strong> {task.assigned_to_name || 'Unknown'}</p>
          <p><strong>Created By:</strong> {task.created_by_name || 'Unknown'}</p>
        </div>

        <div className="card">
          <h3>Comments</h3>
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleAddComment} style={{ marginBottom: '20px' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows="3"
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Comment'}
            </button>
          </form>

          {comments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            <div>
              {comments.map((comment) => (
                <div key={comment.id} style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong>{comment.author_name || 'Unknown'}</strong>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ margin: '5px 0' }}>{comment.content}</p>
                  {comment.user_id === currentUserId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="btn btn-danger"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
