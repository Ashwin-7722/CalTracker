import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../api/api';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) { console.error('Profile load error:', err); }
    finally { setLoading(false); }
  };

  const getInitial = () => (profile?.username || user?.username || '?').charAt(0).toUpperCase();
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  if (loading) return (<div><div className="page-header"><h1>Profile</h1></div><div className="loading-spinner"></div></div>);

  const data = profile || user || {};

  return (
    <div>
      <div className="page-header"><h1>Profile</h1><p>Manage your account settings</p></div>
      <div className="card profile-card animate-fade-in">
        <div className="profile-avatar-large">{getInitial()}</div>
        <div style={{textAlign:'center',marginBottom:'24px'}}>
          <h2 style={{fontSize:'22px',fontWeight:700,color:'var(--gray-900)'}}>{data.username}</h2>
          <p style={{fontSize:'14px',color:'var(--gray-500)'}}>{data.email}</p>
        </div>
        <div className="profile-info-row"><span className="profile-info-label">User ID</span><span className="profile-info-value">#{data.id}</span></div>
        <div className="profile-info-row"><span className="profile-info-label">Username</span><span className="profile-info-value">{data.username}</span></div>
        <div className="profile-info-row"><span className="profile-info-label">Email</span><span className="profile-info-value">{data.email}</span></div>
        <div className="profile-info-row"><span className="profile-info-label">Member Since</span><span className="profile-info-value">{fmtDate(data.created_at)}</span></div>
        <div style={{marginTop:'24px'}}>
          <button className="btn btn-danger btn-block" onClick={logout}>🚪 Logout</button>
        </div>
      </div>
    </div>
  );
}
