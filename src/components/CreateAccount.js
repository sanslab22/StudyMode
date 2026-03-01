import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAccount.css';

function CreateAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Account created:', form);
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

          <div className="ca-next-row">
            <button type="submit" className="ca-next-btn">Next</button>
          </div>
        </form>
      </div>

      <div className="ca-footer">
        <a href="/" className="ca-footer-link" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          Already have an account?
        </a>
        <span className="ca-footer-divider">|</span>
        <a href="/forgot-password" className="ca-footer-link" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>Forgot Password</a>
      </div>
    </div>
  );
}

export default CreateAccount;
