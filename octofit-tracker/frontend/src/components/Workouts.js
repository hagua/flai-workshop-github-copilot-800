import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespaceName
          ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
          : 'http://localhost:8000/api/workouts/';
        
        console.log('Fetching workouts from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Workouts Data:', workoutsData);
        
        setWorkouts(workoutsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="mt-3">Loading workouts...</h3>
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2>💪 OctoFit Workouts</h2>
        <p className="text-muted">Personalized workout suggestions - <strong>{workouts.length}</strong> available</p>
      </div>
      <div className="row">
        {workouts.map((workout) => (
          <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">💪 {workout.name}</h5>
              </div>
              <div className="card-body">
                <p className="card-text">{workout.description}</p>
                <hr />
                <div className="mb-3">
                  <span className={`badge bg-${getDifficultyColor(workout.difficulty)} me-2`}>
                    {workout.difficulty}
                  </span>
                  <span className="badge bg-info">{workout.category}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>⏱️ Duration:</strong>
                    <p className="mb-0 text-primary">
                      <strong>{workout.duration}</strong> minutes
                    </p>
                  </div>
                  <button className="btn btn-sm btn-outline-primary">
                    Start Workout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workouts;
