# Todo App

A full-stack todo application built with React (frontend) and Node.js + Express (backend).

## Tech Stack

- **Frontend:** React 18, React Router v6, Axios
- **Backend:** Node.js, Express.js
- **Storage:** JSON file (`backend/todos.json`) — no database setup needed

## Project Structure

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express server entry
│   │   ├── db.js             # File-based data store
│   │   └── routes/
│   │       └── todos.js      # CRUD routes
│   ├── todos.json            # Auto-created on first run
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── api/todos.js      # Axios API calls
│   │   └── pages/
│   │       ├── TodoList.js   # /todos route
│   │       └── TodoDetail.js # /todo?id=... route
│   └── package.json
├── docs/
│   └── features.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js v16+
- npm

### Run the backend

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:5000`

### Run the frontend

```bash
cd frontend
npm install
npm start
```

App opens at `http://localhost:3000`

The frontend is proxied to port 5000 via the `proxy` field in `frontend/package.json`, so API calls work out of the box.

### Run both together (optional)

You can use two terminal tabs — one for backend, one for frontend.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/todos | Get all todos |
| GET | /api/todos/:id | Get a single todo |
| POST | /api/todos | Create a new todo |
| PUT | /api/todos/:id | Update a todo |
| PATCH | /api/todos/:id | Partial update (e.g. toggle complete) |
| DELETE | /api/todos/:id | Delete a todo |

See `docs/features.md` for full feature list.
