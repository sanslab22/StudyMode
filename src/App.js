import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import ForgotPassword from './components/ForgotPassword';
import Layout from './components/Layout';
import Home from './components/Home';
import Notes from './components/Notes';
import { TimerProvider } from './context/TimerContext';

function App() {
  return (
    <TimerProvider>
    <BrowserRouter>
      <Routes>
        {/* Auth pages */}
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* App pages (shared layout) */}
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/notes" element={<Layout><Notes /></Layout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </TimerProvider>
  );
}

export default App;
