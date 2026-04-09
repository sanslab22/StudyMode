'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './Login.css';

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggled, setToggled] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  const handleLogin = () => {
    if (toggled) return;
    setToggled(true);
    setTimeout(() => setFadingOut(true), 450);
    setTimeout(() => router.push('/home'), 950);
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
          <Link href="/create-account" className="footer-link">Create New Account</Link>
          <span className="footer-divider">|</span>
          <Link href="/forgot-password" className="footer-link">Forgot Password</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
