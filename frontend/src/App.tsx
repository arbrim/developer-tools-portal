import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Check,
  Edit3,
  ExternalLink,
  LogIn,
  LogOut,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { createLink, deleteLink, getLinks, login, updateLink } from './api';
import { getToolIcon, iconOptions } from './iconMap';
import { AuthUser, LinkPayload, ToolLink } from './types';

const emptyForm: LinkPayload = {
  title: '',
  category: '',
  url: '',
  description: '',
  icon: 'ExternalLink',
  isActive: true,
};

function App() {
  const [links, setLinks] = useState<ToolLink[]>([]);
  const [token, setToken] = useState(() => localStorage.getItem('portal_token') ?? '');
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('portal_user');
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });
  const [loginForm, setLoginForm] = useState({ email: 'admin@example.com', password: 'Admin123!' });
  const [form, setForm] = useState<LinkPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'admin';
  const visibleLinks = useMemo(() => links, [links]);

  async function loadLinks() {
    setLoading(true);
    setError('');
    try {
      setLinks(await getLinks(isAdmin));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load links');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLinks();
  }, [isAdmin]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const result = await login(loginForm.email, loginForm.password);
      setToken(result.accessToken);
      setUser(result.user);
      localStorage.setItem('portal_token', result.accessToken);
      localStorage.setItem('portal_user', JSON.stringify(result.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  function logout() {
    setToken('');
    setUser(null);
    localStorage.removeItem('portal_token');
    localStorage.removeItem('portal_user');
  }

  function startEdit(link: ToolLink) {
    setEditingId(link._id);
    setForm({
      title: link.title,
      category: link.category,
      url: link.url,
      description: link.description,
      icon: link.icon ?? 'ExternalLink',
      isActive: link.isActive,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveLink(event: FormEvent) {
    event.preventDefault();
    if (!token) {
      setError('Admin token is required');
      return;
    }

    setError('');
    try {
      if (editingId) {
        await updateLink(editingId, form, token);
      } else {
        await createLink(form, token);
      }
      resetForm();
      await loadLinks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function removeLink(id: string) {
    if (!token || !window.confirm('Delete this link?')) {
      return;
    }

    setError('');
    try {
      await deleteLink(id, token);
      await loadLinks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
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
                <button className="btn-secondary" onClick={logout} type="button">
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleLogin}>
                <input
                  className="input min-w-56"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                  placeholder="Email"
                  type="email"
                />
                <input
                  className="input min-w-40"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
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

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Available Links</h2>
            <button className="icon-button" onClick={loadLinks} title="Refresh links" type="button">
              <RefreshCcw size={18} />
            </button>
          </div>

          {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          {loading ? (
            <div className="rounded-md border border-zinc-200 bg-white p-6 text-sm text-zinc-600">Loading links...</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleLinks.map((link) => {
                const Icon = getToolIcon(link.icon);
                return (
                  <article key={link._id} className="card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
                          <Icon size={21} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold">{link.title}</h3>
                          <p className="truncate text-sm text-zinc-500">{link.category}</p>
                        </div>
                      </div>
                      {!link.isActive && <span className="status-pill">Inactive</span>}
                    </div>
                    <p className="mt-4 min-h-12 text-sm leading-6 text-zinc-600">{link.description}</p>
                    <div className="mt-5 flex items-center justify-between gap-2">
                      <a className="btn-secondary" href={link.url} target="_blank" rel="noreferrer">
                        <ExternalLink size={18} />
                        Open
                      </a>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button className="icon-button" onClick={() => startEdit(link)} title="Edit link" type="button">
                            <Edit3 size={18} />
                          </button>
                          <button className="icon-button danger" onClick={() => removeLink(link._id)} title="Delete link" type="button">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {isAdmin && (
          <aside className="h-fit rounded-md border border-zinc-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Link' : 'Add Link'}</h2>
              {editingId && (
                <button className="icon-button" onClick={resetForm} title="Cancel edit" type="button">
                  <X size={18} />
                </button>
              )}
            </div>
            <form className="space-y-3" onSubmit={saveLink}>
              <input className="input w-full" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" />
              <input className="input w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" />
              <input className="input w-full" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
              <textarea
                className="input min-h-24 w-full resize-y"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
              />
              <select className="input w-full" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  type="checkbox"
                  className="size-4 rounded border-zinc-300"
                />
                Active
              </label>
              <button className="btn-primary w-full justify-center" type="submit">
                {editingId ? <Save size={18} /> : <Plus size={18} />}
                {editingId ? 'Save Changes' : 'Create Link'}
              </button>
              {editingId && (
                <button className="btn-secondary w-full justify-center" onClick={resetForm} type="button">
                  <Check size={18} />
                  Done
                </button>
              )}
            </form>
          </aside>
        )}
      </section>
    </main>
  );
}

export default App;
