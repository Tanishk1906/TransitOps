import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Fleet Manager');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ name: email.split('@')[0], email, role });
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>TransitOps</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" defaultValue="password" required />
          </div>
          <div className="form-group">
            <label>Mock Login Role (RBAC)</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option>Fleet Manager</option>
              <option>Dispatcher</option>
              <option>Safety Officer</option>
              <option>Financial Analyst</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;