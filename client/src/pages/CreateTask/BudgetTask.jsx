import React, { useState } from 'react';
import '../css/CreateTask.css'; 
import { useTaskStore } from '../../store/useTaskStore';

const BudgetStep = ({ onNext, onBack }) => {
  const { taskForm, updateBudget } = useTaskStore();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateBudget({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const amount = taskForm.budget?.amount;
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }
    setError('');
    updateBudget({ amount: parseFloat(amount) });
    console.log("Budget updated:", taskForm.budget);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="budget-wrapper">
        <div className="budget-container">
          <div className="budget-header">
            <h1>Set Your Budget</h1>
            <p className="subtitle">What's your budget for this task?</p>
          </div>
          
          <div className="budget-content">
            <div className="budget-input-group">
              <label>Budget Amount</label>
              <div className="budget-input-wrapper">
                <select
                  name="currency"
                  value={taskForm.budget?.currency || 'USD'}
                  onChange={handleChange}
                  className="currency-select"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="AUD">AUD</option>
                </select>
                <input 
                  type="number" 
                  name="amount"
                  placeholder="Enter amount"
                  value={taskForm.budget?.amount || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="budget-input"
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
          
          <div className="budget-preview">
            <p>Your budget: <strong>{taskForm.budget?.currency || "USD"} {taskForm.budget?.amount || "0.00"}</strong></p>
          </div>
          
          <div className="navigation-buttons">
            <button 
              type="button" 
              className="nav-button back-button" 
              onClick={onBack}
            >
              Back
            </button>
            <button 
              type="submit" 
              className="nav-button next-button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BudgetStep;