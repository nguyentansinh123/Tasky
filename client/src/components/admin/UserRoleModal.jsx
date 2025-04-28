import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './UserRoleModal.css';

const UserRoleModal = ({ user, onClose, onAssignRole }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const availableRoles = ['ADMIN', 'CLIENT', 'WORKER', 'USER'];
  
  const safeRoles = Array.isArray(user.roles) 
    ? user.roles.map(role => String(role)) 
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      return;
    }
    
    setProcessing(true);
    const success = await onAssignRole(user.id, selectedRole);
    setProcessing(false);
    
    if (success) {
      onClose();
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="role-modal">
        <div className="modal-header">
          <h3>Change User Role</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="user-info">
            <div className="user-avatar large">
              {user.firstName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="user-details">
              <h4>{user.firstName} {user.lastName}</h4>
              <p>{user.email}</p>
              <div className="current-roles">
                <span className="current-roles-label">Current Roles: </span>
                {Array.isArray(user.roles) && user.roles.length > 0 ? (
                  user.roles.map((roleObj, index) => {
                    const roleName = typeof roleObj === 'string' 
                      ? roleObj 
                      : roleObj?.name || roleObj?.role || roleObj?.roleName || JSON.stringify(roleObj);
                    
                    const safeClassName = typeof roleName === 'string'
                      ? roleName.toLowerCase()
                      : 'unknown';
                    
                    return (
                      <span key={`role-${index}`} className={`role-badge ${safeClassName}`}>
                        {roleName}
                      </span>
                    );
                  })
                ) : (
                  <span className="no-roles">No roles</span>
                )}
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="role-select">Select New Role</label>
              <select
                id="role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="role-select"
                required
              >
                <option value="">-- Select Role --</option>
                {availableRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <p className="role-note">
                Note: This will replace the user's current role with the selected role.
              </p>
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={onClose}
                disabled={processing}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="assign-button"
                disabled={!selectedRole || processing}
              >
                {processing ? 'Updating...' : 'Update Role'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRoleModal;