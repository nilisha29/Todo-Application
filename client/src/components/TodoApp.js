import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = async () => {
    if (!title.trim()) return;
    const res = await fetch('http://localhost:5000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    const newTodo = await res.json();
    setTodos([newTodo, ...todos]);
    setTitle('');
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: 'DELETE'
    });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = async (todo) => {
    const res = await fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: todo.title, completed: !todo.completed })
    });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === updated.id ? updated : t));
  };

  const saveEdit = async (todo) => {
    const res = await fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, completed: todo.completed })
    });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === updated.id ? updated : t));
    setEditId(null);
    setEditTitle('');
  };

  return (
    <div className="todo-wrapper">
      <div className="todo-container">
        <h1>📝 Todo Application</h1>
        <p className="subtitle">Stay organized and productive</p>

        <div className="add-todo">
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button className="add-btn" onClick={addTodo}>Add Task</button>
        </div>

        <div className="stats">
          <span>Total: {todos.length}</span>
          <span>Completed: {todos.filter(t => t.completed).length}</span>
          <span>Pending: {todos.filter(t => !t.completed).length}</span>
        </div>

        <ul className="todo-list">
          {todos.length === 0 && (
            <p className="empty-msg">No tasks yet! Add one above.</p>
          )}
          {todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {editId === todo.id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo)}
                  />
                  <button className="save-btn" onClick={() => saveEdit(todo)}>Save</button>
                  <button className="cancel-btn" onClick={() => setEditId(null)}>Cancel</button>
                </div>
              ) : (
                <div className="view-mode">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo)}
                  />
                  <span className="todo-title">{todo.title}</span>
                  <div className="action-btns">
                    <button className="edit-btn" onClick={() => { setEditId(todo.id); setEditTitle(todo.title); }}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoApp;