import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/dashboard" className="header-logo">
          my<span>Bank</span>
        </Link>
        {user && (
          <nav className="header-nav">
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
              Operations
            </Link>
            <Link to="/categories" className={location.pathname === '/categories' ? 'active' : ''}>
              Categories
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              Log out
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
