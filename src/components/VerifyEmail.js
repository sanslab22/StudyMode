'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../utils/supabase/client';
import './VerifyEmail.css';

function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const alreadyExists = searchParams.get('unverified') === 'true';

  const [digits, setDigits] = useState(['', '', '', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(alreadyExists ? 'Account already exists. We resent the code.' : '');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const boxRefs = useRef([]);

  useEffect(() => {
    boxRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...digits];
    updated[index] = value.slice(-1);
    setDigits(updated);
    if (value && index < 7) boxRefs.current[index + 1]?.focus();
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      boxRefs.current[index - 1]?.focus();
    }
  };

  const handleDigitPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (!pasted) return;
    e.preventDefault();
    const updated = [...digits];
    pasted.split('').forEach((char, i) => { updated[i] = char; });
    setDigits(updated);
    boxRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const token = digits.join('');
    if (token.length < 8) return;
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });
    setLoading(false);
    if (authError) { setError(authError.message); return; }
    router.push('/home');
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setNotice('');
    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    setResending(false);
    if (resendError) { setError(resendError.message); return; }
    setNotice('Code resent — check your inbox.');
    setDigits(['', '', '', '', '', '', '', '']);
    boxRefs.current[0]?.focus();
  };

  return (
    <div className="ve-page">
      <h1 className="ve-title">study/&lt;mode&gt;</h1>

      <div className="ve-content">
        <p className="ve-heading">Verify Your Email</p>
        <p className="ve-subtext">
          We sent an 8-digit code to{' '}
          <span className="ve-highlight">{email || 'your email'}</span>.
          Enter it below to activate your account.
        </p>

        {notice && <p className="ve-notice">{notice}</p>}

        <form className="ve-code-form" onSubmit={handleVerify}>
          <div className="ve-code-boxes">
            {digits.map((digit, i) => (
              <input
                key={i}
                className="ve-code-box"
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

          {error && <p className="ve-error">{error}</p>}

          <div className="ve-next-row">
            <button
              type="submit"
              className="ve-next-btn"
              disabled={loading || digits.join('').length < 8}
            >
              {loading ? 'Verifying…' : 'Verify'}
            </button>
          </div>
        </form>

        <p className="ve-help">
          Didn&apos;t get a code?{' '}
          <span className="ve-highlight ve-resend" onClick={handleResend}>
            {resending ? 'Sending…' : 'Resend'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;
