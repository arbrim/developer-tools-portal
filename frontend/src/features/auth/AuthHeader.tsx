import { FormEvent } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { AuthUser } from '../../types';

interface LoginFormState {
  email: string;
  password: string;
}

interface AuthHeaderProps {
  loginForm: LoginFormState;
  user: AuthUser | null;
  onLogin: (event: FormEvent) => void;
  onLoginFormChange: (loginForm: LoginFormState) => void;
  onLogout: () => void;
}

export function AuthHeader({ loginForm, user, onLogin, onLoginFormChange, onLogout }: AuthHeaderProps) {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Internal Platform</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal text-zinc-950">Developer Tools Portal</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {user ? (
            <>
              <div className="text-sm text-zinc-600">
                Signed in as <span className="font-semibold text-zinc-950">{user.name}</span> ({user.role})
              </div>
              <button className="btn-secondary" onClick={onLogout} type="button">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <form className="flex flex-col gap-2 sm:flex-row" onSubmit={onLogin}>
              <input
                className="input min-w-56"
                value={loginForm.email}
                onChange={(event) => onLoginFormChange({ ...loginForm, email: event.target.value })}
                placeholder="Email"
                type="email"
              />
              <input
                className="input min-w-40"
                value={loginForm.password}
                onChange={(event) => onLoginFormChange({ ...loginForm, password: event.target.value })}
                placeholder="Password"
                type="password"
              />
              <button className="btn-primary" type="submit">
                <LogIn size={18} />
                Login
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
