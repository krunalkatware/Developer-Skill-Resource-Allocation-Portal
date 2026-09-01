import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login = ({ onShowToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const authUser = await login(email, password);
      if (onShowToast) {
        onShowToast(`Welcome back, ${authUser.name}!`, 'success');
      }
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Top Header Bar */}
      <header className="py-3 px-4 d-flex justify-content-between align-items-center border-bottom" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
        <div className="d-flex align-items-center gap-2">
          <div className="brand-icon" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
            <i className="bi bi-cpu-fill"></i>
          </div>
          <span className="fw-bold fs-5" style={{ color: 'var(--text-primary)' }}>
            DevResource
          </span>
        </div>

        <button
          type="button"
          className="btn-saas-secondary py-1 px-3"
          onClick={toggleTheme}
          style={{ fontSize: '0.82rem' }}
        >
          <i className={`bi ${isDark ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-primary'}`}></i>
          <span className="ms-1">{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </header>

      {/* Main Split Layout */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-3 p-md-4">
        <div
          className="saas-card w-100"
          style={{
            maxWidth: '1000px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div className="row g-0">
            {/* Left Brand Introduction Column */}
            <div
              className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between"
              style={{
                backgroundColor: 'var(--bg-secondary-surface)',
                borderRight: '1px solid var(--border-color)',
              }}
            >
              <div>
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4" style={{ backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 600 }}>
                  <i className="bi bi-shield-check"></i> Enterprise Resource Portal
                </div>

                <h2 className="fw-bold mb-3" style={{ color: 'var(--text-primary)', fontSize: '1.75rem', lineHeight: '1.3' }}>
                  Manage your development resources smarter.
                </h2>
                <p className="text-secondary mb-4" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                  Match technical skills with project requirements and allocate the right developer to the right task with data-driven precision.
                </p>

                {/* Value Propositions */}
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)' }}
                    >
                      <i className="bi bi-check2"></i>
                    </div>
                    <div>
                      <div className="fw-semibold" style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                        Rule-Based Skill Matching
                      </div>
                      <div className="text-secondary" style={{ fontSize: '0.78rem' }}>
                        Calculate exact match percentages across technical proficiencies
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{ width: '32px', height: '32px', backgroundColor: 'var(--success-subtle)', color: 'var(--success)' }}
                    >
                      <i className="bi bi-diagram-3"></i>
                    </div>
                    <div>
                      <div className="fw-semibold" style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                        Dynamic Resource Allocation
                      </div>
                      <div className="text-secondary" style={{ fontSize: '0.78rem' }}>
                        Track developer bandwidth and prevent project bottlenecks
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{ width: '32px', height: '32px', backgroundColor: 'var(--warning-subtle)', color: 'var(--warning)' }}
                    >
                      <i className="bi bi-kanban"></i>
                    </div>
                    <div>
                      <div className="fw-semibold" style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                        End-to-End Task Lifecycle
                      </div>
                      <div className="text-secondary" style={{ fontSize: '0.78rem' }}>
                        From skill requirements to assignment and completion
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Fast-Fill Selector */}
              <div className="pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                <div className="text-secondary fw-semibold mb-2" style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Quick Demo Accounts (Click to Fill):
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    style={{ fontSize: '0.76rem' }}
                    onClick={() => handleQuickFill('admin@example.com', 'admin123')}
                  >
                    <i className="bi bi-shield-lock me-1"></i> Admin (Resource Mgr)
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    style={{ fontSize: '0.76rem' }}
                    onClick={() => handleQuickFill('rahul@example.com', 'dev123')}
                  >
                    <i className="bi bi-person me-1"></i> Rahul (Full Stack)
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    style={{ fontSize: '0.76rem' }}
                    onClick={() => handleQuickFill('amit@example.com', 'dev123')}
                  >
                    <i className="bi bi-person me-1"></i> Amit (Backend)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Login Card Column */}
            <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-center bg-card">
              <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>
                <div className="mb-4">
                  <h3 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>
                    Sign in to DevResource
                  </h3>
                  <p className="text-secondary mb-0" style={{ fontSize: '0.86rem' }}>
                    Internal organization credentials
                  </p>
                </div>

                {errorMsg && (
                  <div className="alert alert-danger py-2 px-3 mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.84rem' }}>
                    <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                    <div>{errorMsg}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="saas-form-label" htmlFor="email">
                      Corporate Email Address
                    </label>
                    <div className="position-relative">
                      <input
                        id="email"
                        type="email"
                        className="saas-form-control ps-4"
                        placeholder="e.g. admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                      />
                      <i
                        className="bi bi-envelope position-absolute text-muted"
                        style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                      ></i>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="saas-form-label mb-0" htmlFor="password">
                        Password
                      </label>
                    </div>
                    <div className="position-relative">
                      <input
                        id="password"
                        type="password"
                        className="saas-form-control ps-4"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <i
                        className="bi bi-lock position-absolute text-muted"
                        style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                      ></i>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="form-check">
                      <input
                        id="rememberMe"
                        type="checkbox"
                        className="form-check-input"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label text-secondary" htmlFor="rememberMe" style={{ fontSize: '0.82rem' }}>
                        Remember my session
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-saas-primary w-100 py-2"
                    disabled={loading}
                    style={{ fontSize: '0.95rem' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right"></i> Sign In to Portal
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Credentials Note */}
                <div
                  className="mt-4 p-3 rounded-3"
                  style={{
                    backgroundColor: 'var(--primary-subtle)',
                    border: '1px dashed var(--primary)',
                    fontSize: '0.8rem',
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2 fw-semibold" style={{ color: 'var(--primary)' }}>
                    <i className="bi bi-info-circle-fill"></i>
                    Demo Credentials — Click to auto-fill
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <button
                      type="button"
                      className="btn btn-sm w-100 text-start d-flex justify-content-between align-items-center"
                      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
                      onClick={() => handleQuickFill('admin@example.com', 'admin123')}
                    >
                      <span><i className="bi bi-shield-lock-fill me-2 text-primary"></i><strong>Admin</strong> — admin@example.com</span>
                      <span className="text-muted">admin123</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm w-100 text-start d-flex justify-content-between align-items-center"
                      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
                      onClick={() => handleQuickFill('rahul@example.com', 'dev123')}
                    >
                      <span><i className="bi bi-person-fill me-2 text-success"></i><strong>Developer</strong> — rahul@example.com</span>
                      <span className="text-muted">dev123</span>
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-center text-secondary" style={{ fontSize: '0.78rem' }}>
                  Protected internal portal • Authorized organizational personnel only
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
