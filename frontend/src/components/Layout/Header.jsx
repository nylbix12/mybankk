import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials, getDisplayName } from '../../utils/format';
import './Header.scss';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const displayName = getDisplayName(user?.email);
  const initials = getInitials(displayName);

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <Link to="/dashboard" className="header__logo">
            <span className="header__logo-icon">🏦</span>
            <span>myBank</span>
          </Link>
          <nav className="header__nav">
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
              Operations
            </Link>
            <Link to="/categories" className={location.pathname === '/categories' ? 'active' : ''}>
              Categories
            </Link>
          </nav>
        </div>
        <div className="header__right" ref={ref}>
          <button className="header__avatar" onClick={() => setOpen(!open)}>
            {initials}
          </button>
          {open && (
            <div className="header__dropdown">
              <button className="header__dropdown-item" onClick={handleLogout}>
                <span>→</span> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
