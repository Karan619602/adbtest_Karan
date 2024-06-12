import React, { useState, useEffect } from 'react';
import './App.css'

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/todos/')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching TODOs:', error));
  }, []);

  const handleSubmit = (e) => {

    e.preventDefault();
    if (!newTodo.trim()) {
      alert('ToDo cannot be empty.');
      return;
    }
    fetch('http://localhost:8000/todos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: newTodo }),
    })
      .then(response => response.json())
      .then(data => { setTodos([...todos, data.data ? data.data : '']) })
      .catch(error => console.error('Error adding TODO:', error));

    setNewTodo('');
  };


  return (
    <div className="App">
      <div>
        <ul>
          {todos?.map((todo, index) => (
            <li key={index}>{todo?.description}</li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Create a ToDo</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label for="todo">ToDo: </label>

            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter TODO"
            />
          </div>
          <div style={{ "marginTop": "5px" }}>
            <button type='submit'>Add ToDo!</button>
          </div>      
          </form>
      </div>
    </div>

  );
};

export default App;
