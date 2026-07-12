import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">🚛 TransitOps</div>
        <nav>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
          
          {/* Strict RBAC Routing in UI */}
          {['Fleet Manager', 'Admin'].includes(user.role) && <NavLink to="/vehicles">Vehicles</NavLink>}
          {['Safety Officer', 'Admin'].includes(user.role) && <NavLink to="/drivers">Drivers</NavLink>}
          {['Dispatcher', 'Admin'].includes(user.role) && <NavLink to="/trips">Trips</NavLink>}
          {['Fleet Manager', 'Admin'].includes(user.role) && <NavLink to="/maintenance">Maintenance</NavLink>}
          {['Financial Analyst', 'Admin'].includes(user.role) && <NavLink to="/fuel-expenses">Fuel & Expenses</NavLink>}
          {['Financial Analyst', 'Admin'].includes(user.role) && <NavLink to="/reports">Reports</NavLink>}
        </nav>
        <div className="user-info">
          <p><strong>{user.name}</strong></p>
          <p style={{color: '#0dcaf0'}}>{user.role}</p>
          <button onClick={handleLogout} className="btn btn-sm" style={{background: '#dc3545', color: 'white', width: '100%', marginTop: '10px'}}>Logout</button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet /> {/* This renders the active page (Dashboard, Vehicles, etc.) */}
      </main>
    </div>
  );
};
export default Layout;