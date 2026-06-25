const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readTodos, writeTodos } = require('../db');

const router = express.Router();

// GET /api/todos — get all todos
router.get('/', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// GET /api/todos/:id — get single todo
router.get('/:id', (req, res) => {
  const todos = readTodos();
  const todo = todos.find(t => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// POST /api/todos — create todo
router.post('/', (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTodo = {
    id: uuidv4(),
    title: title.trim(),
    description: description ? description.trim() : '',
    completed: false,
    priority: priority || 'medium',
    dueDate: dueDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const todos = readTodos();
  todos.push(newTodo);
  writeTodos(todos);

  res.status(201).json(newTodo);
});

// PUT /api/todos/:id — full update
router.put('/:id', (req, res) => {
  const todos = readTodos();
  const idx = todos.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Todo not found' });

  const { title, description, completed, priority, dueDate } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  todos[idx] = {
    ...todos[idx],
    title: title.trim(),
    description: description !== undefined ? description.trim() : todos[idx].description,
    completed: completed !== undefined ? completed : todos[idx].completed,
    priority: priority || todos[idx].priority,
    dueDate: dueDate !== undefined ? dueDate : todos[idx].dueDate,
    updatedAt: new Date().toISOString(),
  };

  writeTodos(todos);
  res.json(todos[idx]);
});

// PATCH /api/todos/:id — partial update (e.g. toggle complete)
router.patch('/:id', (req, res) => {
  const todos = readTodos();
  const idx = todos.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Todo not found' });

  todos[idx] = {
    ...todos[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeTodos(todos);
  res.json(todos[idx]);
});

// DELETE /api/todos/:id — delete todo
router.delete('/:id', (req, res) => {
  const todos = readTodos();
  const idx = todos.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Todo not found' });

  todos.splice(idx, 1);
  writeTodos(todos);

  res.json({ message: 'Todo deleted' });
});

module.exports = router;
