# Features & Functionality

## Page 1 — Todo List (`/todos`)

### Viewing Todos
- All todos are fetched from the backend on page load and displayed as a list
- Each todo shows its title, priority badge, and due date (if set)
- Completed todos are shown with a strikethrough on the title

### Adding a Todo
- Click **+ Add Todo** to expand the add form
- Required field: title
- Optional fields: description, priority (low / medium / high), due date
- Clicking **Add Todo** sends a POST request and adds it to the list immediately

### Completing a Todo
- Each todo has a checkbox on the left
- Clicking it toggles the `completed` field via a PATCH request
- The UI updates immediately without a page reload

### Deleting a Todo
- Each todo has a ✕ button on the right
- Clicking it shows a confirmation prompt before sending a DELETE request

### Filtering
- Three filter tabs: **All**, **Active**, **Completed**
- Active = todos where completed is false
- Completed = todos where completed is true

### Searching
- Search bar filters todos by title in real time (client-side, no extra API call)

### Sorting
- Sort by: **Newest first** (default, by createdAt), **Due Date**, or **Priority** (high → medium → low)

### Count
- Footer shows "X remaining · Y done" at a glance

---

## Page 2 — Todo Detail (`/todo?id=<todoId>`)

### Accessing the Page
- Click on any todo title/row on the list page
- The todo's ID is passed as a query parameter: `/todo?id=<uuid>`
- The page fetches that specific todo from `GET /api/todos/:id`

### Viewing Todo Details
- Title
- Status badge (Active / Completed) with color indicator
- Description
- Priority (color-coded badge)
- Due date (formatted)
- Created at and Updated at timestamps

### Editing a Todo
- Click **Edit** to enter edit mode
- Editable fields: title, description, priority, due date
- Click **Save** to send a PUT request and update the displayed data
- Click **Cancel** to discard changes

### Toggling Completion
- A **Mark Complete / Mark Incomplete** button is shown alongside the status badge
- Sends a PATCH request to toggle the `completed` field

### Deleting from Detail Page
- A **Delete** button with a confirmation prompt
- On confirm, sends DELETE request and redirects back to `/todos`

### Navigation
- **← Back to todos** link at the top returns to the list page

---

## Backend

### Data Persistence
- Todos are saved in `backend/todos.json`
- The file is created automatically on first run if it doesn't exist
- Each write overwrites the file with the updated array (simple, no race condition risk at this scale)

### Validation
- Title is required on POST and PUT — returns 400 if missing or empty
- Returns 404 if a todo with the given ID doesn't exist

### Todo Fields

| Field | Type | Notes |
|-------|------|-------|
| id | string | UUID v4, auto-generated |
| title | string | Required |
| description | string | Optional, defaults to empty string |
| completed | boolean | Defaults to false |
| priority | string | low / medium / high, defaults to medium |
| dueDate | string | ISO date string or null |
| createdAt | string | ISO datetime, set on create |
| updatedAt | string | ISO datetime, updated on every change |
