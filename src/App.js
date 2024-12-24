// src/App.js
import React from 'react';
import ExpenseForm from './components/ExpenseForm';
import './styles/global.css'; // Make sure this import is correct


const App = () => {
  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <ExpenseForm /> {/* Render the ExpenseForm component */}
    </div>
  );
}

export default App;
