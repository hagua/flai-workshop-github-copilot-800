import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespaceName
          ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
          : 'http://localhost:8000/api/teams/';
        
        console.log('Fetching teams from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Teams API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Teams Data:', teamsData);
        
        setTeams(teamsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="mt-3">Loading teams...</h3>
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
        <h2>🏆 OctoFit Teams</h2>
        <p className="text-muted">Total Teams: <strong>{teams.length}</strong></p>
      </div>
      <div className="row">
        {teams.map((team) => (
          <div key={team.id} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">🎯 {team.name}</h5>
              </div>
              <div className="card-body">
                <p className="card-text">{team.description}</p>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <strong>Created:</strong> {new Date(team.created_at).toLocaleDateString()}
                  </small>
                  <span className="badge bg-info">Team ID: {team.id}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;
