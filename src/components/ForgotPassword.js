'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './ForgotPassword.css';

function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState('emailEntry');
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const boxRefs = useRef([]);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...digits];
    updated[index] = value.slice(-1);
    setDigits(updated);
    if (value && index < 5) boxRefs.current[index + 1].focus();
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      boxRefs.current[index - 1].focus();
    }
  };

  const handleDigitPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const updated = [...digits];
    pasted.split('').forEach((char, i) => { updated[i] = char; });
    setDigits(updated);
    const nextEmpty = Math.min(pasted.length, 5);
    boxRefs.current[nextEmpty].focus();
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // TODO: send code to email via Firebase
    setStep('enterCode');
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    // TODO: verify code via Firebase
    setStep('resetPassword');
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    // TODO: update password via Firebase
    setStep('confirmation');
  };

  // ── Step 1: Enter Email ──
  if (step === 'emailEntry') {
    return (
      <div className="fp-page">
        <h1 className="fp-title">study/&lt;mode&gt;</h1>

        <div className="fp-content">
          <p className="fp-heading">Forgot Your Password ?</p>
          <p className="fp-subtext">
            Enter your email address and we&apos;ll send you a verification code.
          </p>

          <form className="fp-email-form" onSubmit={handleEmailSubmit}>
            <input
              className="fp-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="fp-next-row">
              <button type="submit" className="fp-next-btn">Next</button>
            </div>
          </form>

          <p className="fp-help">
            Need help? Reach out to our support team at{' '}
            <span className="fp-highlight">studymode@gmail.com</span>
          </p>
        </div>

        <div className="fp-footer">
          <Link href="/create-account" className="fp-footer-link">
            Create New Account
          </Link>
          <span className="fp-footer-divider">|</span>
          <Link href="/" className="fp-footer-link">
            Already have an account?
          </Link>
        </div>
      </div>
    );
  }

  // ── Step 2: Enter Code ──
  if (step === 'enterCode') {
    return (
      <div className="fp-page">
        <h1 className="fp-title">study/&lt;mode&gt;</h1>

        <div className="fp-content">
          <p className="fp-heading">Check Your Email</p>
          <p className="fp-subtext">
            We sent a verification code to{' '}
            <span className="fp-highlight">{email}</span>. Enter it below.
          </p>

          <form className="fp-email-form" onSubmit={handleCodeSubmit}>
            <div className="fp-code-boxes">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  className="fp-code-box"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (boxRefs.current[i] = el)}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(i, e)}
                  onPaste={handleDigitPaste}
                />
              ))}
            </div>
            <div className="fp-next-row">
              <button type="submit" className="fp-next-btn" disabled={digits.join('').length < 6}>Next</button>
            </div>
          </form>

          <p className="fp-help">
            Didn&apos;t get a code?{' '}
            <span className="fp-highlight fp-resend" onClick={() => console.log('Resend code')}>
              Resend
            </span>
          </p>
        </div>
      </div>
    );
  }

  // ── Step 3: Reset Password ──
  if (step === 'resetPassword') {
    return (
      <div className="fp-page">
        <h1 className="fp-title">study/&lt;mode&gt;</h1>

        <div className="fp-card">
          <form className="fp-reset-form" onSubmit={handleResetSubmit}>
            <div className="fp-row">
              <label className="fp-label">New Password</label>
              <input
                className="fp-card-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="fp-row">
              <label className="fp-label">Confirm Password</label>
              <input
                className="fp-card-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="fp-next-row">
              <button type="submit" className="fp-next-btn">Next</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── Step 4: Confirmation ──
  if (step === 'confirmation') {
    return (
      <div className="fp-page">
        <h1 className="fp-title">study/&lt;mode&gt;</h1>
        <div className="fp-confirm-content">
          <p className="fp-confirm-text">Your password has been reset successfully</p>
          <hr className="fp-divider" />
          <p className="fp-confirm-sub">Please click below to navigate to login page</p>
          <button className="fp-next-btn" onClick={() => router.push('/')}>Login</button>
        </div>
      </div>
    );
  }
}

export default ForgotPassword;
