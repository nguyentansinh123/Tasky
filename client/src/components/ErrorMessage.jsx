import React from 'react';

const ErrorMessage = ({ message, retry, cancel }) => {
  return (
    <div className="error-message-container">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message}</p>
      <div className="error-actions">
        {retry && (
          <button onClick={retry} className="error-retry-btn">
            Try Again
          </button>
        )}
        {cancel && (
          <button onClick={cancel} className="error-cancel-btn">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;