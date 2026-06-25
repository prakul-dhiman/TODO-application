import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTodo, updateTodo, patchTodo, deleteTodo } from '../api/todos';
import './TodoDetail.css';

function TodoDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [todo, setTodo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/todos');
      return;
    }
    fetchTodo();
  }, [id]);

  const fetchTodo = async () => {
    try {
      const res = await getTodo(id);
      setTodo(res.data);
      setForm(res.data);
    } catch {
      setError('Todo not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    try {
      const res = await updateTodo(id, form);
      setTodo(res.data);
      setEditing(false);
    } catch {
      setError('Failed to save changes');
    }
  };

  const handleToggle = async () => {
    try {
      const res = await patchTodo(id, { completed: !todo.completed });
      setTodo(res.data);
      setForm(res.data);
    } catch {
      setError('Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this todo?')) return;
    try {
      await deleteTodo(id);
      navigate('/todos');
    } catch {
      setError('Failed to delete');
    }
  };

  const priorityColor = { high: '#e74c3c', medium: '#f39c12', low: '#27ae60' };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (loading) return <div className="page"><p className="msg">Loading...</p></div>;
  if (error) return <div className="page"><p className="msg error">{error}</p><button className="btn-back" onClick={() => navigate('/todos')}>← Back</button></div>;

  return (
    <div className="page">
      <button className="btn-back" onClick={() => navigate('/todos')}>← Back to todos</button>

      <div className="detail-card">
        <div className="detail-header">
          {editing ? (
            <input
              className="edit-title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          ) : (
            <h2 className={todo.completed ? 'done' : ''}>{todo.title}</h2>
          )}
          <div className="detail-actions">
            {editing ? (
              <>
                <button className="btn-save" onClick={handleSave}>Save</button>
                <button className="btn-cancel" onClick={() => { setEditing(false); setForm(todo); }}>Cancel</button>
              </>
            ) : (
              <button className="btn-edit" onClick={() => setEditing(true)}>Edit</button>
            )}
            <button className="btn-delete" onClick={handleDelete}>Delete</button>
          </div>
        </div>

        <div className="detail-body">
          <div className="field">
            <label>Status</label>
            <div className="status-toggle">
              <span className={`status-badge ${todo.completed ? 'completed' : 'active'}`}>
                {todo.completed ? 'Completed' : 'Active'}
              </span>
              <button className="btn-toggle" onClick={handleToggle}>
                {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
            </div>
          </div>

          <div className="field">
            <label>Description</label>
            {editing ? (
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            ) : (
              <p>{todo.description || <span className="empty-val">No description</span>}</p>
            )}
          </div>

          <div className="field">
            <label>Priority</label>
            {editing ? (
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            ) : (
              <span className="priority-badge" style={{ background: priorityColor[todo.priority] }}>
                {todo.priority}
              </span>
            )}
          </div>

          <div className="field">
            <label>Due Date</label>
            {editing ? (
              <input
                type="date"
                value={form.dueDate || ''}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              />
            ) : (
              <p>{todo.dueDate ? formatDate(todo.dueDate) : <span className="empty-val">Not set</span>}</p>
            )}
          </div>

          <div className="meta-dates">
            <span>Created: {formatDate(todo.createdAt)}</span>
            <span>Updated: {formatDate(todo.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoDetail;
