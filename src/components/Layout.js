'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { NotesProvider } from '../context/NotesContext';
import './Layout.css';

function Layout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef(null);

  useEffect(() => {
    if (!avatarMenuOpen) return;
    const handleClick = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [avatarMenuOpen]);

  return (
    <div className="layout">
      <nav className="navbar">
        <button className="nav-hamburger" onClick={() => setSidebarOpen(o => !o)}>
          <span /><span /><span />
        </button>
        <span className="nav-title" onClick={() => router.push('/home')}>study/&lt;mode&gt;</span>
        <div className="nav-avatar-wrap" ref={avatarRef}>
          <div className="nav-avatar" onClick={() => setAvatarMenuOpen(o => !o)} />
          {avatarMenuOpen && (
            <div className="avatar-dropdown">
              <button className="avatar-dropdown-item" onClick={() => { setAvatarMenuOpen(false); }}>Profile</button>
              <button className="avatar-dropdown-item avatar-dropdown-item--danger" onClick={() => { setAvatarMenuOpen(false); router.push('/'); }}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      <div className="layout-body">
        <NotesProvider>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="layout-main">{children}</main>
        </NotesProvider>
      </div>
    </div>
  );
}

export default Layout;
