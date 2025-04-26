import React, { useState } from 'react';
import '../pages/css/SearchBar.css'; 

const priceOptions = ['Any price', '$0 - $50', '$50 - $100', '$100+'];
const sortOptions = ['Relevance', 'Newest', 'Price: Low to High', 'Price: High to Low'];

const SearchBar = () => {
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(priceOptions[0]);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  return (
    <div className="search-container">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search for a task" 
          className="search-input"
          aria-label="Search for a task"
        />
        <div className="dropdown" tabIndex={0} onBlur={() => setShowPriceDropdown(false)}>
          <button
            className="dropdown-button"
            aria-label="Filter by price"
            onClick={() => setShowPriceDropdown(v => !v)}
            type="button"
          >
            {selectedPrice} <span className="dropdown-arrow">▼</span>
          </button>
          {showPriceDropdown && (
            <ul className="dropdown-list">
              {priceOptions.map(option => (
                <li
                  key={option}
                  className={`dropdown-list-item${selectedPrice === option ? ' selected' : ''}`}
                  onMouseDown={() => {
                    setSelectedPrice(option);
                    setShowPriceDropdown(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="dropdown">
          <button className="dropdown-button" aria-label="Other filters">
            Other filters (1) <span className="dropdown-arrow">▼</span>
          </button>
        </div>
        <div className="dropdown" tabIndex={0} onBlur={() => setShowSortDropdown(false)}>
          <button
            className="dropdown-button"
            aria-label="Sort"
            onClick={() => setShowSortDropdown(v => !v)}
            type="button"
          >
            {selectedSort} <span className="dropdown-arrow">▼</span>
          </button>
          {showSortDropdown && (
            <ul className="dropdown-list">
              {sortOptions.map(option => (
                <li
                  key={option}
                  className={`dropdown-list-item${selectedSort === option ? ' selected' : ''}`}
                  onMouseDown={() => {
                    setSelectedSort(option);
                    setShowSortDropdown(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;