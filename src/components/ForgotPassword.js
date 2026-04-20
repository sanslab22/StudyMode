'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabase/client';
import './ForgotPassword.css';

function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState('emailEntry');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStep('resetPassword');
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/forgot-password`,
    });
    setLoading(false);
    if (authError) { setError(authError.message); return; }
    setStep('linkSent');
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (authError) { setError(authError.message); return; }
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
            Enter your email address and we&apos;ll send you a reset link.
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
            {error && <p className="fp-error">{error}</p>}
            <div className="fp-next-row">
              <button type="submit" className="fp-next-btn" disabled={loading}>
                {loading ? 'Sending…' : 'Next'}
              </button>
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

  // ── Step 2: Link Sent ──
  if (step === 'linkSent') {
    return (
      <div className="fp-page">
        <h1 className="fp-title">study/&lt;mode&gt;</h1>

        <div className="fp-content">
          <p className="fp-heading">Check Your Email</p>
          <p className="fp-subtext">
            We sent a password reset link to{' '}
            <span className="fp-highlight">{email}</span>. Click the link to
            continue.
          </p>

          <p className="fp-help">
            Didn&apos;t get it?{' '}
            <span className="fp-highlight fp-resend" onClick={handleEmailSubmit}>
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
            {error && <p className="fp-error">{error}</p>}
            <div className="fp-next-row">
              <button type="submit" className="fp-next-btn" disabled={loading}>
                {loading ? 'Saving…' : 'Next'}
              </button>
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
