import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const TokenDebugger = () => {
  const { token, authUser } = useAuthStore();
  
  const debugToken = () => {
    console.log("Token exists:", !!token);
    if (token) {
      console.log("Token preview:", token.substring(0, 20) + "...");
      console.log("Token structure:", token.startsWith("Bearer ") ? "Has Bearer prefix" : "Missing Bearer prefix");
      console.log("Token format valid:", token.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/) ? "Valid JWT format" : "Invalid format");
    }
    
    console.log("Auth user:", authUser);
    
    if (authUser) {
      console.log("User email:", authUser.email);
    }
  };
  
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
      <button onClick={debugToken} style={{ 
        padding: '8px 12px', 
        background: '#444', 
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Debug Token
      </button>
    </div>
  );
};

export default TokenDebugger;