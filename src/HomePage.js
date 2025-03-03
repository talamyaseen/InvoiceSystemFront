import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="container text-center">
      <h1>Welcome to Our App</h1>
      <div className="mt-4">
        <button
          onClick={handleLoginClick}
          className="btn btn-light btn-lg"
          style={{ backgroundColor: '#90EE90', margin: '10px' }}
        >
          Login
        </button>
        <button
          onClick={handleSignupClick}
          className="btn btn-light btn-lg"
          style={{ backgroundColor: '#90EE90', margin: '10px' }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default HomePage;
