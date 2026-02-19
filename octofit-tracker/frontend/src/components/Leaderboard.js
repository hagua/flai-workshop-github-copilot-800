import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespaceName
          ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
          : 'http://localhost:8000/api/leaderboard/';
        
        console.log('Fetching leaderboard from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Leaderboard API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Leaderboard Data:', leaderboardData);
        
        setLeaderboard(leaderboardData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="mt-3">Loading leaderboard...</h3>
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

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-warning text-dark';
    if (rank === 2) return 'bg-secondary text-white';
    if (rank === 3) return 'bg-danger text-white';
    return 'bg-primary';
  };
  
  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏅';
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2>🏆 OctoFit Leaderboard</h2>
        <p className="text-muted">Competition Rankings - <strong>{leaderboard.length}</strong> participants</p>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col" className="text-center">Rank</th>
              <th scope="col">User</th>
              <th scope="col">Team</th>
              <th scope="col" className="text-center">Total Points</th>
              <th scope="col" className="text-center">Total Calories</th>
              <th scope="col">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry.id}>
                <td className="text-center">
                  <h4 className="mb-0">
                    <span className={`badge ${getRankBadge(entry.rank)}`}>
                      {getRankIcon(entry.rank)} #{entry.rank}
                    </span>
                  </h4>
                </td>
                <td>
                  <div>
                    <strong>{entry.user?.name || 'Unknown User'}</strong>
                    <br />
                    <span className="badge bg-info">@{entry.user?.username || 'N/A'}</span>
                  </div>
                </td>
                <td>
                  {entry.team ? (
                    <span className="badge bg-primary">{entry.team.name}</span>
                  ) : (
                    <span className="badge bg-secondary">No Team</span>
                  )}
                </td>
                <td className="text-center">
                  <h5 className="mb-0 text-success">
                    <strong>{entry.total_points}</strong> pts
                  </h5>
                </td>
                <td className="text-center">
                  <h5 className="mb-0 text-danger">
                    <strong>{entry.total_calories}</strong> cal
                  </h5>
                </td>
                <td>{new Date(entry.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
