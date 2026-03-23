import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { chantingAPI, statsAPI } from '../api';
import './Dashboard.css';

const LOGO_IMAGE = '/logo.png';

const StatCard = ({ label, value, icon, highlight }) => (
  <div className={`stat-card ${highlight ? 'stat-card--highlight' : ''}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();

  const [todayRounds, setTodayRounds] = useState(0);
  const [globalStats, setGlobalStats] = useState({
    roundsChantedToday: 0,
    totalRoundsWorldWelfare: 0,
    totalDevotees: 0
  });
  const [loadingData, setLoadingData] = useState(true);
  const [updateMode, setUpdateMode] = useState(false);
  const [inputRounds, setInputRounds] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoadingData(true);
    try {
      const [todayRes, statsRes] = await Promise.all([
        chantingAPI.getToday(),
        statsAPI.getGlobal()
      ]);
      if (todayRes.data.success) {
        setTodayRounds(todayRes.data.rounds);
      }
      if (statsRes.data.success) {
        setGlobalStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleUpdate = async () => {
    const roundsToAdd = parseInt(inputRounds, 10);
    if (isNaN(roundsToAdd) || roundsToAdd <= 0) {
      setUpdateMsg({ type: 'error', text: 'Please enter a number greater than 0' });
      return;
    }
    setUpdating(true);
    setUpdateMsg(null);
    try {
      const { data } = await chantingAPI.update(roundsToAdd);
      if (data.success) {
        setTodayRounds(data.rounds);
        updateUser({ totalRoundsByMe: data.totalRoundsByMe });
        setUpdateMsg({ type: 'success', text: data.message });
        setInputRounds('');
        setUpdateMode(false);
        // Refresh global stats
        const statsRes = await statsAPI.getGlobal();
        if (statsRes.data.success) setGlobalStats(statsRes.data.stats);
      }
    } catch (err) {
      setUpdateMsg({ type: 'error', text: err.response?.data?.message || 'Update failed. Please try again.' });
    } finally {
      setUpdating(false);
    }
  };

  const todayDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="header-brand">
            <img src={LOGO_IMAGE} alt="Logo" className="dashboard-logo"
              onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <p className="brand-sub">Naam Upchar</p>
              <h1 className="brand-title">World Welfare<br />Desire Tree</h1>
            </div>
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">
            <span>⬡</span> Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Welcome strip */}
        <div className="welcome-strip">
          <div className="welcome-text">
            <span className="welcome-greeting">🙏 Jai Shri Ram,</span>
            <span className="welcome-name">{user?.name}</span>
          </div>
          <div className="welcome-date">{todayDate}</div>
        </div>

        {/* Today's chanting card */}
        <div className="today-card">
          <div className="today-card-header">
            <span className="today-label">Today's Rounds by Me</span>
            <button
              className="edit-btn"
              onClick={() => { setUpdateMode(!updateMode); setUpdateMsg(null); setInputRounds(''); }}
            >
              {updateMode ? '✕ Cancel' : '➕ Add Rounds'}
            </button>
          </div>

          {!updateMode ? (
            <div className="today-rounds-display">
              <div className="rounds-number">{todayRounds}</div>
              <div className="rounds-unit">rounds today</div>
            </div>
          ) : (
            <div className="update-section">
              <p className="add-rounds-hint">How many rounds did you just complete?</p>
              {updateMsg && (
                <div className={`message ${updateMsg.type}`}>{updateMsg.text}</div>
              )}
              <div className="update-input-row">
                <button
                  className="round-adjust-btn"
                  onClick={() => setInputRounds(v => String(Math.max(1, parseInt(v || 1) - 1)))}
                >−</button>
                <input
                  type="number"
                  className="rounds-input"
                  value={inputRounds}
                  onChange={(e) => setInputRounds(e.target.value)}
                  min="1"
                  placeholder="0"
                  autoFocus
                />
                <button
                  className="round-adjust-btn"
                  onClick={() => setInputRounds(v => String(parseInt(v || 0) + 1))}
                >+</button>
              </div>
              <p className="add-rounds-preview">
                {parseInt(inputRounds) > 0
                  ? `${todayRounds} + ${inputRounds} = ${todayRounds + parseInt(inputRounds)} rounds today`
                  : `Currently ${todayRounds} rounds today`}
              </p>
              <button className="btn-primary save-btn" onClick={handleUpdate} disabled={updating}>
                {updating ? '🙏 Saving...' : '➕ Add These Rounds'}
              </button>
            </div>
          )}

          {updateMsg && !updateMode && (
            <div className={`message ${updateMsg.type}`} style={{ marginTop: '12px' }}>{updateMsg.text}</div>
          )}
        </div>

        {/* WhatsApp Group */}
        <a
          href="https://chat.whatsapp.com/IXoGr09bpUmG6FJBOYkzdA?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-dashboard-btn"
        >
          <span>💬</span>
          Join Our WhatsApp Group
        </a>

        {/* Stats grid */}
        {loadingData ? (
          <div className="stats-loading">
            <span>Loading blessings... 🙏</span>
          </div>
        ) : (
          <div className="stats-grid">
            <StatCard
              label="Total Rounds by Me"
              value={user?.totalRoundsByMe || 0}
              icon="🧿"
            />
            <StatCard
              label="Total Rounds Today (All Devotees)"
              value={globalStats.roundsChantedToday}
              icon="🌅"
            />
            <StatCard
              label="Total Devotees"
              value={globalStats.totalDevotees}
              icon="👥"
            />
            <StatCard
              label="Total Rounds for World Welfare"
              value={globalStats.totalRoundsWorldWelfare}
              icon="🌍"
              highlight={true}
            />
          </div>
        )}

        {/* User info card */}
        <div className="user-info-card">
          <h3 className="user-info-title">My Details</h3>
          <div className="user-info-grid">
            <div className="user-info-item">
              <span className="ui-label">Name</span>
              <span className="ui-value">{user?.name}</span>
            </div>
            <div className="user-info-item">
              <span className="ui-label">City</span>
              <span className="ui-value">{user?.city}</span>
            </div>
            <div className="user-info-item">
              <span className="ui-label">State</span>
              <span className="ui-value">{user?.state}</span>
            </div>
            <div className="user-info-item">
              <span className="ui-label">Country</span>
              <span className="ui-value">{user?.country}</span>
            </div>
          </div>
        </div>

        {/* Inspirational footer */}
        <div className="mantra-footer">
          <p className="mantra-text">ॐ हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे, हरे राम हरे राम, राम राम हरे हरे ॐ</p>
          <p className="mantra-tagline">Every round you chant heals the world 🌸</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
