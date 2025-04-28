import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { FaUsersCog, FaSearch, FaSpinner, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserRoleModal from '../../components/admin/UserRoleModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { getToken, authUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filterRole, setFilterRole] = useState('');
  const [accessChecked, setAccessChecked] = useState(false);
  
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = getToken();
        if (!token) {
          toast.error('Authentication required');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:9193/api/v1/users/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setAccessChecked(true);
        setUsers(response.data.data || []);
        setFilteredUsers(response.data.data || []);
        setLoading(false);
        
      } catch (error) {
        console.error('Error checking admin access:', error);
        
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
          toast.error('You do not have permission to access the admin dashboard');
          navigate('/');
        } else {
          toast.error('Failed to verify admin access');
        }
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [getToken, navigate]);

  const fetchUsers = async () => {
    if (!accessChecked) return;
    
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        toast.error('Authentication required');
        navigate('/login');
        return;
      }
      
      const response = await axios.get('http://localhost:9193/api/v1/users/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success) {
        if (response.data.data && response.data.data.length > 0) {
          const sampleUser = response.data.data[0];
          console.log('Sample user roles structure:', sampleUser.roles);
          if (sampleUser.roles && sampleUser.roles.length > 0) {
            console.log('First role type:', typeof sampleUser.roles[0]);
            console.log('First role value:', sampleUser.roles[0]);
          }
        }
        
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } else {
        toast.error(response.data?.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again.');
      
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        toast.error('Your admin session has expired or been revoked');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.firstName?.toLowerCase().includes(value.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(value.toLowerCase()) ||
        user.email?.toLowerCase().includes(value.toLowerCase()) ||
        user.id?.toString().includes(value)
      );
      setFilteredUsers(filtered);
    }
  };

  const handleRoleFilterChange = (e) => {
    const role = e.target.value;
    setFilterRole(role);
    
    if (!role) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => {
        if (!user.roles || !Array.isArray(user.roles)) return false;
        
        return user.roles.some(roleObj => {
          if (typeof roleObj === 'string') {
            return roleObj === role;
          } else {
            const roleName = roleObj?.name || roleObj?.role || roleObj?.roleName;
            return roleName === role;
          }
        });
      });
      setFilteredUsers(filtered);
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredUsers(sortedUsers);
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleAssignRole = async (userId, roleName) => {
    try {
      const token = getToken();
      
      if (!token) {
        toast.error('Authentication required');
        return false;
      }
      
      const response = await axios.put(
        `http://localhost:9193/api/v1/roles/${userId}`,
        {
          name: roleName  
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.success) {
        toast.success(`Role ${roleName} assigned successfully`);
        fetchUsers();
        return true;
      } else {
        toast.error(response.data?.message || 'Failed to assign role');
        return false;
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error(error.response?.data?.message || 'Failed to assign role');
      return false;
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' 
        ? <FaSortAmountUp className="sort-icon" /> 
        : <FaSortAmountDown className="sort-icon" />;
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!accessChecked && loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div className="admin-title">
          <FaUsersCog size={24} />
          <h1>User Management</h1>
        </div>
        <div className="admin-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <FaFilter className="filter-icon" />
            <select 
              value={filterRole} 
              onChange={handleRoleFilterChange}
              className="role-filter"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="CLIENT">Client</option>
              <option value="WORKER">Worker</option>
              <option value="USER">User</option>
            </select>
          </div>
          
          <button 
            onClick={fetchUsers} 
            className="refresh-button"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh List'}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading users...</p>
        </div>
      ) : (
        <>
          <div className="users-count">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('id')}>
                    ID {getSortIcon('id')}
                  </th>
                  <th onClick={() => requestSort('firstName')}>
                    Name {getSortIcon('firstName')}
                  </th>
                  <th onClick={() => requestSort('email')}>
                    Email {getSortIcon('email')}
                  </th>
                  <th onClick={() => requestSort('createdAt')}>
                    Created {getSortIcon('createdAt')}
                  </th>
                  <th>Roles</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <div className="user-name-cell">
                          <div className="user-avatar">
                            {user.firstName?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="user-name">
                            {user.firstName} {user.lastName}
                            {user.verified && <span className="verified-badge">✓</span>}
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="roles-container">
                          {user.roles && Array.isArray(user.roles) && user.roles.length > 0 ? (
                            user.roles.map((roleObj, index) => {
                              const roleName = typeof roleObj === 'string' 
                                ? roleObj 
                                : roleObj?.name || roleObj?.role || roleObj?.roleName || JSON.stringify(roleObj);
                              
                              const safeClassName = typeof roleName === 'string'
                                ? roleName.toLowerCase()
                                : 'unknown';
                              
                              return (
                                <span key={`${user.id}-role-${index}`} className={`role-badge ${safeClassName}`}>
                                  {roleName}
                                </span>
                              );
                            })
                          ) : (
                            <span className="no-roles">No roles</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="actions-container">
                          <button
                            onClick={() => handleOpenRoleModal(user)}
                            className="action-button role-button"
                          >
                            Change Role
                          </button>
                          <button
                            onClick={() => navigate(`/task-user/${user.id}`)}
                            className="action-button view-button"
                          >
                            View Profile
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-users-message">
                      No users found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {showRoleModal && selectedUser && (
        <UserRoleModal
          user={selectedUser}
          onClose={() => setShowRoleModal(false)}
          onAssignRole={handleAssignRole}
        />
      )}
    </div>
  );
};

export default AdminDashboard;