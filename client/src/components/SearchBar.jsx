import React from 'react';
import '../pages/css/SearchBar.css'; 

const SearchBar = () => {
  return (
    <div className="search-container">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search for a task" 
          className="search-input"
        />
        <div className="dropdown">
          <button className="dropdown-button">
            Any price <span className="dropdown-arrow">▼</span>
          </button>
        </div>
        <div className="dropdown">
          <button className="dropdown-button">
            Other filters (1) <span className="dropdown-arrow">▼</span>
          </button>
        </div>
        <div className="dropdown">
          <button className="dropdown-button">
            Sort <span className="dropdown-arrow">▼</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;