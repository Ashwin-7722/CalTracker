import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddMealPage from './pages/AddMealPage';
import MealHistoryPage from './pages/MealHistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import './index.css';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [authMode, setAuthMode] = useState('login');
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Auth screens
  if (!isAuthenticated) {
    if (authMode === 'login') {
      return <LoginPage onSwitch={() => setAuthMode('register')} />;
    }
    return <RegisterPage onSwitch={() => setAuthMode('login')} />;
  }

  // Render active page
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'add-meal': return <AddMealPage onNavigate={setActivePage} />;
      case 'meals': return <MealHistoryPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'profile': return <ProfilePage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="app-layout">
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <Sidebar
        activePage={activePage}
        onNavigate={(page) => { setActivePage(page); setSidebarOpen(false); }}
      />

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
