import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggled, setToggled] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  const handleLogin = () => {
    if (toggled) return;
    setToggled(true);
    setTimeout(() => setFadingOut(true), 450);
    setTimeout(() => navigate('/home'), 950);
  };

  return (
    <div className={`login-page ${fadingOut ? 'login-page--exit' : ''}`}>
      <div className="login-container">
        <h1 className="login-title">study/&lt;mode&gt;</h1>

        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            className="login-input"
            placeholder="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className={`login-btn ${toggled ? 'login-btn--active' : ''}`}
            onClick={handleLogin}
          >
            <span className="login-btn-circle" />
            <span className="login-btn-text">Login</span>
          </button>
        </form>

        <div className="login-footer">
          <a href="/create-account" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/create-account'); }}>Create New Account</a>
          <span className="footer-divider">|</span>
          <a href="/forgot-password" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>Forgot Password</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
