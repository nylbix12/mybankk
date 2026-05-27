import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/ui/PasswordInput';
import './Auth.scss';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (password !== confirm) {
      setErrors({ confirm: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    try {
      const displayName = email.split('@')[0];
      await register(displayName, '', email, password);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else setErrors({ general: err.response?.data?.message || 'Registration failed.' });
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
        <h1>Create your account</h1>
        <p className="auth-layout__subtitle">Start managing your expenses today</p>
        {errors.general && <div className="auth-error">{errors.general}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your.email@example.com" required autoFocus />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <PasswordInput value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password" />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Confirm password</label>
            <PasswordInput value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Confirm your password" />
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-layout__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
