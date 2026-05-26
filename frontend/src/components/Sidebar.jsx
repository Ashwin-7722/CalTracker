import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activePage, onNavigate }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'add-meal', icon: '🍽️', label: 'Add Meal' },
    { id: 'meals', icon: '📋', label: 'Meal History' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  const getInitial = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return '?';
  };

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🔥</div>
        <div>
          <div className="sidebar-logo-text">CalTrack</div>
          <span className="sidebar-logo-sub">Calorie Tracker</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{getInitial()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.username || 'User'}</div>
            <div className="sidebar-user-email">{user?.email || ''}</div>
          </div>
        </div>
        <button
          id="logout-btn"
          className="nav-item"
          onClick={logout}
          style={{ color: '#ef4444', marginTop: '8px' }}
        >
          <span className="nav-item-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
