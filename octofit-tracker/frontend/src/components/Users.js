import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    team_id: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const getApiUrl = () => {
    const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
    return codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api`
      : 'http://localhost:8000/api';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        const baseUrl = codespaceName
          ? `https://${codespaceName}-8000.app.github.dev/api`
          : 'http://localhost:8000/api';
        
        // Fetch users from: https://${codespaceName}-8000.app.github.dev/api/users/
        const usersResponse = await fetch(`${baseUrl}/users/`);
        if (!usersResponse.ok) {
          throw new Error(`HTTP error! status: ${usersResponse.status}`);
        }
        const usersData = await usersResponse.json();
        const usersList = usersData.results || usersData;
        setUsers(usersList);

        // Fetch teams
        const teamsResponse = await fetch(`${baseUrl}/teams/`);
        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json();
          const teamsList = teamsData.results || teamsData;
          setTeams(teamsList);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      name: user.name || '',
      email: user.email || '',
      team_id: user.team_id || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ username: '', name: '', email: '', team_id: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      const baseUrl = getApiUrl();
      const response = await fetch(`${baseUrl}/users/${editingUser.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          email: formData.email,
          team_id: formData.team_id === '' ? null : parseInt(formData.team_id)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update user');
      }

      // Refresh users list
      const usersResponse = await fetch(`${baseUrl}/users/`);
      const usersData = await usersResponse.json();
      const usersList = usersData.results || usersData;
      setUsers(usersList);

      handleCloseModal();
      setSaveLoading(false);
    } catch (err) {
      console.error('Error updating user:', err);
      alert(`Error: ${err.message}`);
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="mt-3">Loading users...</h3>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2>👥 OctoFit Users</h2>
        <p className="text-muted">Total Users: <strong>{users.length}</strong></p>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Full Name</th>
              <th scope="col">Email</th>
              <th scope="col">Team</th>
              <th scope="col">Joined</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <th scope="row">{user.id}</th>
                <td>
                  <span className="badge bg-info">@{user.username || 'N/A'}</span>
                </td>
                <td className="fw-bold">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.team_id ? (
                    <span className="badge bg-primary">Team {user.team_id}</span>
                  ) : (
                    <span className="badge bg-secondary">No Team</span>
                  )}
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(user)}
                  >
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">✏️ Edit User Details</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                  disabled={saveLoading}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      disabled={saveLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={saveLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={saveLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="team_id" className="form-label">Team</label>
                    <select
                      className="form-select"
                      id="team_id"
                      name="team_id"
                      value={formData.team_id}
                      onChange={handleInputChange}
                      disabled={saveLoading}
                    >
                      <option value="">No Team</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                    disabled={saveLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-warning"
                    disabled={saveLoading}
                  >
                    {saveLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      '💾 Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
