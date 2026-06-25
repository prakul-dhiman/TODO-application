import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodos, createTodo, deleteTodo, patchTodo } from '../api/todos';
import './TodoList.css';

function TodoList() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // all | active | completed
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await getTodos();
      setTodos(res.data);
    } catch {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      const res = await createTodo(form);
      setTodos(prev => [...prev, res.data]);
      setForm({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowForm(false);
    } catch {
      setError('Failed to create todo');
    }
  };

  const handleToggle = async (todo) => {
    try {
      const res = await patchTodo(todo.id, { completed: !todo.completed });
      setTodos(prev => prev.map(t => t.id === todo.id ? res.data : t));
    } catch {
      setError('Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this todo?')) return;
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch {
      setError('Failed to delete todo');
    }
  };

  const filtered = todos
    .filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'dueDate') return (a.dueDate || '') > (b.dueDate || '') ? 1 : -1;
      if (sortBy === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const priorityBadge = (p) => {
    const colors = { high: '#e74c3c', medium: '#f39c12', low: '#27ae60' };
    return (
      <span style={{
        background: colors[p], color: '#fff',
        padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600
      }}>{p}</span>
    );
  };

  return (
    <div className="page">
      <div className="header">
        <h1>My Todos</h1>
        <button className="btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? 'Cancel' : '+ Add Todo'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <form className="add-form" onSubmit={handleAdd}>
          <input
            placeholder="Title *"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={2}
          />
          <div className="form-row">
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn-primary">Add Todo</button>
        </form>
      )}

      <div className="controls">
        <input
          className="search"
          placeholder="Search todos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filters">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              className={filter === f ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <select className="sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="createdAt">Sort: Newest</option>
          <option value="dueDate">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
        </select>
      </div>

      {loading ? (
        <p className="empty">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="empty">No todos found.</p>
      ) : (
        <ul className="todo-list">
          {filtered.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
              />
              <div className="todo-info" onClick={() => navigate(`/todo?id=${todo.id}`)}>
                <span className="todo-title">{todo.title}</span>
                <div className="todo-meta">
                  {priorityBadge(todo.priority)}
                  {todo.dueDate && <span className="due">Due: {todo.dueDate}</span>}
                </div>
              </div>
              <button className="btn-delete" onClick={() => handleDelete(todo.id)}>✕</button>
            </li>
          ))}
        </ul>
      )}

      <p className="count">
        {todos.filter(t => !t.completed).length} remaining · {todos.filter(t => t.completed).length} done
      </p>
    </div>
  );
}

export default TodoList;
