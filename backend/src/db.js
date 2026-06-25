const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'todos.json');

function readTodos() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
    return [];
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeTodos(todos) {
  fs.writeFileSync(DB_PATH, JSON.stringify(todos, null, 2));
}

module.exports = { readTodos, writeTodos };
