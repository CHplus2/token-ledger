import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Lock, Mail } from 'lucide-react';
import { Logo } from '../common/Logo';
import { MOCK_USERS } from '../../mockData';
import { UserProfile } from '../../types';

const NAVY = '#132043';
const GOLD = '#C9A227';
const LIGHT_BG = '#E7EDF4';
const DARK_TEXT = '#16233A';
const MUTED_TEXT = '#6B7A90';

interface SignInPageProps {
  onSignIn: (user: UserProfile) => void;
  onBack: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onSignIn, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const resolveUser = (): UserProfile => {
    const match = MOCK_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    return match || MOCK_USERS[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Enter one of the demo account emails below, or pick one directly.');
      return;
    }
    onSignIn(resolveUser());
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: LIGHT_BG, color: DARK_TEXT }}
    >
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-70 transition-opacity cursor-pointer"
          style={{ color: MUTED_TEXT }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to overview
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Logo size={44} />
          <span className="text-xl font-bold tracking-tight">Token Ledger</span>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-1">Sign in to your workspace</h1>
          <p className="text-base mb-6" style={{ color: MUTED_TEXT }}>
            Demo environment — any of the accounts below will sign you in with that person's role and permissions.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Work email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: MUTED_TEXT }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="sarah.lim@meridiancap.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border text-base outline-none focus:border-purple-400"
                  style={{ borderColor: '#e2e8f0', color: DARK_TEXT }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: MUTED_TEXT }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Any password works in this demo"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border text-base outline-none focus:border-purple-400"
                  style={{ borderColor: '#e2e8f0', color: DARK_TEXT }}
                />
              </div>
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-base font-semibold shadow-lg transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-7 pt-6 border-t" style={{ borderColor: '#e2e8f0' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: MUTED_TEXT }}>
              Or sign in directly as a demo account:
            </p>
            <div className="space-y-2">
              {MOCK_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSignIn(user)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border hover:bg-[#f8fafc] transition-colors cursor-pointer text-left"
                  style={{ borderColor: '#e2e8f0' }}
                >
                  <span>
                    <span className="block text-sm font-bold" style={{ color: DARK_TEXT }}>
                      {user.name}
                    </span>
                    <span className="block text-xs" style={{ color: MUTED_TEXT }}>
                      {user.title}
                    </span>
                  </span>
                  <span
                    className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0"
                    style={{ backgroundColor: `${NAVY}14`, color: NAVY }}
                  >
                    {user.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: MUTED_TEXT }}>
          No real credentials are stored or verified — this is a demo environment for Meridian Capital Group.
        </p>
      </div>
    </div>
  );
};
