import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getTodos = () => api.get('/todos');
export const getTodo = (id) => api.get(`/todos/${id}`);
export const createTodo = (data) => api.post('/todos', data);
export const updateTodo = (id, data) => api.put(`/todos/${id}`, data);
export const patchTodo = (id, data) => api.patch(`/todos/${id}`, data);
export const deleteTodo = (id) => api.delete(`/todos/${id}`);
