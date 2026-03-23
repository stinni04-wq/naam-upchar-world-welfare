import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import './LandingPage.css';

const PANDIT_IMAGE = '/pandit.jpg'; // user should place the image in public folder
const LOGO_IMAGE = '/logo.png';     // user should place the logo in public folder

const LandingPage = () => {
  const { login } = useAuth();
  const [view, setView] = useState('home'); // home | register | login
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Register form state
  const [form, setForm] = useState({
    name: '', city: '', state: '', country: '', mobile: ''
  });

  // Login form state
  const [loginMobile, setLoginMobile] = useState('');

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, city, state, country, mobile } = form;
    if (!name || !city || !state || !country || !mobile) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const { data } = await authAPI.register(form);
      if (data.success) {
        login(data.token, data.user);
      }
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.alreadyExists) {
        setMessage({ type: 'error', text: 'Mobile already registered. Please login instead.' });
        setTimeout(() => { setView('login'); setLoginMobile(form.mobile); setMessage(null); }, 2000);
      } else {
        setMessage({ type: 'error', text: errData?.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginMobile) {
      setMessage({ type: 'error', text: 'Please enter your mobile number' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const { data } = await authAPI.login(loginMobile);
      if (data.success) {
        login(data.token, data.user);
      }
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.notFound) {
        setMessage({ type: 'error', text: 'No account found. Please register first.' });
        setTimeout(() => { setView('register'); setMessage(null); }, 2000);
      } else {
        setMessage({ type: 'error', text: errData?.message || 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (view === 'register') {
    return (
      <div className="landing-wrapper">
        <div className="page-container">
          {/* Header */}
          <div className="page-header">
            <button className="back-btn" onClick={() => { setView('home'); setMessage(null); }}>
              ← Back
            </button>
            <div className="header-logo-row">
              <img src={LOGO_IMAGE} alt="Logo" className="header-logo" onError={(e) => { e.target.style.display='none'; }} />
              <div>
                <p className="header-subtitle">Naam Upchar</p>
                <h1 className="header-title-sm">World Welfare<br/>Desire Tree</h1>
              </div>
            </div>
          </div>

          <div className="form-card">
            <h2 className="form-title">🙏 Join the Sangh</h2>
            <p className="form-desc">Register to track your naam jap and contribute to world welfare</p>

            {message && <div className={`message ${message.type}`}>{message.text}</div>}

            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label>Your Name</label>
                <input name="name" value={form.name} onChange={handleFormChange}
                  placeholder="Enter your full name" />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleFormChange} placeholder="City" />
                </div>
                <div className="input-group">
                  <label>State</label>
                  <input name="state" value={form.state} onChange={handleFormChange} placeholder="State" />
                </div>
              </div>
              <div className="input-group">
                <label>Country</label>
                <input name="country" value={form.country} onChange={handleFormChange} placeholder="Country" />
              </div>
              <div className="input-group">
                <label>Mobile Number</label>
                <input name="mobile" value={form.mobile} onChange={handleFormChange}
                  placeholder="+91 98765 43210" type="tel" />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? '🙏 Registering...' : '🌳 Register & Join'}
              </button>
            </form>

            <p className="switch-link">
              Already registered?{' '}
              <button className="link-btn" onClick={() => { setView('login'); setMessage(null); }}>
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="landing-wrapper">
        <div className="page-container">
          <div className="page-header">
            <button className="back-btn" onClick={() => { setView('home'); setMessage(null); }}>
              ← Back
            </button>
            <div className="header-logo-row">
              <img src={LOGO_IMAGE} alt="Logo" className="header-logo" onError={(e) => { e.target.style.display='none'; }} />
              <div>
                <p className="header-subtitle">Naam Upchar</p>
                <h1 className="header-title-sm">World Welfare<br/>Desire Tree</h1>
              </div>
            </div>
          </div>

          <div className="form-card">
            <h2 className="form-title">🙏 Welcome Back</h2>
            <p className="form-desc">Enter your registered mobile number to continue</p>

            {message && <div className={`message ${message.type}`}>{message.text}</div>}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Mobile Number</label>
                <input
                  value={loginMobile}
                  onChange={(e) => { setLoginMobile(e.target.value); setMessage(null); }}
                  placeholder="+91 98765 43210"
                  type="tel"
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? '🙏 Logging in...' : '🕉️ Enter Sangh'}
              </button>
            </form>

            <p className="switch-link">
              New here?{' '}
              <button className="link-btn" onClick={() => { setView('register'); setMessage(null); }}>
                Register now
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Home view
  return (
    <div className="landing-wrapper">
      <div className="landing-hero">
        {/* Decorative Om symbols */}
        <div className="floating-om om-1">ॐ</div>
        <div className="floating-om om-2">ॐ</div>
        <div className="floating-om om-3">ॐ</div>

        {/* Header */}
        <div className="hero-header">
          <div className="hero-logo-row">
            <img src={LOGO_IMAGE} alt="Naam Upchar Logo" className="hero-logo"
              onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="hero-title-block">
              <p className="hero-subtitle-text">Naam Upchar</p>
              <h1 className="hero-title">World Welfare<br />Desire Tree</h1>
            </div>
          </div>
        </div>

        {/* Pandit Image */}
        <div className="pandit-image-container">
          <div className="pandit-image-frame">
            <img
              src={PANDIT_IMAGE}
              alt="Naam Upchar - Spiritual Guide"
              className="pandit-image"
              onError={(e) => {
                e.target.parentElement.innerHTML = `
                  <div style="
                    width:100%; height:100%; display:flex; align-items:center;
                    justify-content:center; background:linear-gradient(135deg,#FF6B00,#FFB300);
                    border-radius:50%; font-size:80px;
                  ">🙏</div>`;
              }}
            />
          </div>
          <div className="pandit-glow"></div>
        </div>

        {/* Links below pandit photo */}
        <div className="pandit-links">
          <a href="https://naamupchar.in" target="_blank" rel="noopener noreferrer" className="pandit-link">
            <span className="pandit-link-icon">🌐</span>
            <span>naamupchar.in</span>
          </a>
          <a href="https://www.youtube.com/@naamupchar8454" target="_blank" rel="noopener noreferrer" className="pandit-link pandit-link--yt">
            <span className="pandit-link-icon">▶</span>
            <span>Youtube: NAAM UPCHAR</span>
          </a>
        </div>

        {/* Divider text */}
        <div className="mantra-strip">
          <span>🌸 हरि नाम जप से विश्व कल्याण 🌸</span>
        </div>

        {/* CTA */}
        <div className="hero-cta">
          <p className="cta-tagline">
            Register here for chanting <strong>Naam</strong> for world welfare.
            Track your daily rounds and see the collective power of naam jap.
          </p>
          <button className="btn-primary hero-register-btn" onClick={() => setView('register')}>
            🌳 Register Now
          </button>
          <button className="btn-secondary" onClick={() => setView('login')}>
            Already Registered? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
