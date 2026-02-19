import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespaceName
          ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
          : 'http://localhost:8000/api/activities/';
        
        console.log('Fetching activities from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Activities Data:', activitiesData);
        
        setActivities(activitiesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="mt-3">Loading activities...</h3>
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
        <h2>🏃 OctoFit Activities</h2>
        <p className="text-muted">Total Activities: <strong>{activities.length}</strong></p>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">User</th>
              <th scope="col">Activity Type</th>
              <th scope="col">Duration</th>
              <th scope="col">Calories</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <th scope="row">{activity.id}</th>
                <td>
                  <span className="badge bg-secondary">User {activity.user_id}</span>
                </td>
                <td>
                  <span className="badge bg-info">{activity.activity_type}</span>
                </td>
                <td><strong>{activity.duration}</strong> min</td>
                <td><strong>{activity.calories_burned}</strong> kcal</td>
                <td>
                  {activity.date ? new Date(activity.date + 'T00:00:00').toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Activities;
