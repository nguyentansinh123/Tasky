import React, { useState } from 'react';
import '../css/CreateTask.css';

const BudgetStep = ({ onNext, onBack }) => {
  const [budget, setBudget] = useState({
    amount: '',
    currency: 'USD'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBudget(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="task-content">
        <h2 className="section-title createTaskTitle">Suggest Your Budget</h2>

        <div className="form-group">
          <label className="form-label">
            What's your budget for this task?
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              className="date-select"
              name="currency"
              value={budget.currency}
              onChange={handleChange}
              style={{ width: '100px' }}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <input 
              type="number" 
              className="task-input"
              name="amount"
              placeholder="Enter amount"
              value={budget.amount}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button type="button" className="nav-button back-button" onClick={onBack}>
          Back
        </button>
        <button type="submit" className="nav-button next-button">
          Next
        </button>
      </div>
    </form>
  );
};

export default BudgetStep;