import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="auth-page">
    <div className="auth-card" style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '64px' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ margin: '12px 0 24px' }}>The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn-primary" style={{ display: 'inline-block' }}>
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;