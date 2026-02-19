import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src="/octofitapp-small.png" alt="OctoFit Logo" />
              🏋️ OctoFit Tracker
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">
                    Teams
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">
                    Activities
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    Leaderboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">
                    Workouts
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Welcome to OctoFit Tracker! 🏋️</h1>
        <p className="lead">
          Track your fitness journey, compete with your team, and achieve your goals!
        </p>
        <hr className="my-4" />
        <p className="text-muted">
          Use the navigation menu above to explore users, teams, activities, leaderboard, and workouts.
        </p>
        
        <div className="row mt-5 g-4">
          <div className="col-md-4">
            <Link to="/users" className="text-decoration-none">
              <div className="card border-primary h-100 card-hover">
                <div className="card-body text-center">
                  <h2 className="mb-3">👥</h2>
                  <h5 className="card-title">Users</h5>
                  <p className="card-text">View all registered OctoFit users and their profiles.</p>
                  <div className="btn btn-primary">
                    View Users
                  </div>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="col-md-4">
            <Link to="/leaderboard" className="text-decoration-none">
              <div className="card border-success h-100 card-hover">
                <div className="card-body text-center">
                  <h2 className="mb-3">🏆</h2>
                  <h5 className="card-title">Leaderboard</h5>
                  <p className="card-text">Check the rankings and see who's leading the competition!</p>
                  <div className="btn btn-success">
                    View Leaderboard
                  </div>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="col-md-4">
            <div className="card border-warning h-100">
              <div className="card-body text-center">
                <h2 className="mb-3">💪</h2>
                <h5 className="card-title">Workouts</h5>
                <p className="card-text">Discover personalized workout suggestions for your goals.</p>
                <Link to="/workouts" className="btn btn-warning">
                  View Workouts
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row mt-4 g-4">
          <div className="col-md-6">
            <div className="card border-info h-100">
              <div className="card-body text-center">
                <h2 className="mb-3">🎯</h2>
                <h5 className="card-title">Teams</h5>
                <p className="card-text">Join a team and compete together for the top spot!</p>
                <Link to="/teams" className="btn btn-info">
                  View Teams
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <Link to="/activities" className="text-decoration-none">
              <div className="card border-danger h-100 card-hover">
                <div className="card-body text-center">
                  <h2 className="mb-3">🏃</h2>
                  <h5 className="card-title">Activities</h5>
                  <p className="card-text">Track and log your daily fitness activities and progress.</p>
                  <div className="btn btn-danger">
                    View Activities
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="alert alert-info mt-5" role="alert">
          <h5 className="alert-heading">🚀 Getting Started</h5>
          <p className="mb-0">
            Start tracking your fitness journey today! Navigate through the menu to explore all features.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

