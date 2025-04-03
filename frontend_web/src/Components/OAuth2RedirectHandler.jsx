import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const userId = queryParams.get('userId');
    const email = queryParams.get('email');
    const userData = queryParams.get('data');
    
    if (token && userId) {
      // Store authentication data
      localStorage.setItem('token', token);
      
      let user = {
        id: userId,
        email: email
      };
      
      // Try to parse additional user data if available
      if (userData) {
        try {
          const decodedData = atob(userData);
          const parsedUser = JSON.parse(decodedData);
          user = { ...parsedUser, id: userId, email: email };
        } catch (err) {
          console.error('Error parsing user data:', err);
        }
      }
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Set the Authorization header for all future API requests
      if (window.axios) {
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Verify the token is valid with a backend endpoint
      fetch('http://localhost:8080/api/public/verify-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.ok) {
          // Token is valid, redirect to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          throw new Error('Token validation failed');
        }
      })
      .catch(err => {
        console.error('Token verification error:', err);
        setError('Authentication failed: ' + err.message);
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      });
    } else {
      const errorMsg = queryParams.get('error') || 'OAuth authentication failed';
      setError(errorMsg);
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    }
  }, [navigate]);
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          <p>Authentication Error: {error}</p>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Logging you in...</p>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;