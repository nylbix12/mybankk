import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/ui/PasswordInput';
import './Auth.scss';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-layout__panel">
        <p className="auth-layout__tagline">Take control of your money</p>
      </div>
      <div className="auth-layout__form">
        <p className="auth-layout__brand">myBank</p>
        <h1>Welcome back</h1>
        <p className="auth-layout__subtitle">Log in to access your account</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your.email@example.com" required autoFocus />
          </div>
          <div className="form-group">
            <label>Password</label>
            <PasswordInput value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password" />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>
        <p className="auth-layout__footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
