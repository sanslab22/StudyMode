'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabase/client';
import './CreateAccount.css';

function CreateAccount() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { first_name: form.firstName, last_name: form.lastName },
      },
    });
    setLoading(false);
    if (authError) { setError(authError.message); return; }
    if (data.user?.identities?.length === 0) {
      setError('An account with this email already exists. Try logging in instead.');
      return;
    }
    router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
  };

  return (
    <div className="ca-page">
      <h1 className="ca-title">study/&lt;mode&gt;</h1>

      <div className="ca-card">
        <form className="ca-form" onSubmit={handleSubmit}>
          <div className="ca-row">
            <label className="ca-label">First Name</label>
            <input className="ca-input" type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="ca-row">
            <label className="ca-label">Last Name</label>
            <input className="ca-input" type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
          <div className="ca-row">
            <label className="ca-label">Email</label>
            <input className="ca-input" type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="ca-row">
            <label className="ca-label">Password</label>
            <input className="ca-input" type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="ca-row">
            <label className="ca-label">Confirm Password</label>
            <input className="ca-input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
          </div>

          {error && <p className="ca-error">{error}</p>}

          <div className="ca-next-row">
            <button type="submit" className="ca-next-btn" disabled={loading}>
              {loading ? 'Creating…' : 'Next'}
            </button>
          </div>
        </form>
      </div>

      <div className="ca-footer">
        <Link href="/" className="ca-footer-link">
          Already have an account?
        </Link>
        <span className="ca-footer-divider">|</span>
        <Link href="/forgot-password" className="ca-footer-link">Forgot Password</Link>
      </div>
    </div>
  );
}

export default CreateAccount;
