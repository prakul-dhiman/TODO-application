import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './pages/TodoList';
import TodoDetail from './pages/TodoDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/todos" element={<TodoList />} />
        <Route path="/todo" element={<TodoDetail />} />
        <Route path="*" element={<Navigate to="/todos" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
