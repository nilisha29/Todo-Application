import React, { useState, useEffect } from 'react';
import '../App.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  // Get all todos
  useEffect(() => {
    fetch('http://localhost:5000/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  // Add todo
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

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: 'DELETE'
    });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Toggle complete
  const toggleComplete = async (todo) => {
    const res = await fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: todo.title, completed: !todo.completed })
    });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === updated.id ? updated : t));
  };

  return (
    <div className="todo-container">
      <h1>Todo Application</h1>

      {/* Add Todo */}
      <div className="add-todo">
        <input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Todo List */}
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo)}
            />
            <span>{todo.title}</span>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;