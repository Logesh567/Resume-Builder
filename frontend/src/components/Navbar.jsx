import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <FileText size={22} />
        <span>ResumeAI</span>
      </Link>
      {user && (
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <span className="nav-user">👋 {user.full_name || user.email}</span>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;