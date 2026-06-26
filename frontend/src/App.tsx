import { FormEvent, useCallback, useEffect, useState } from 'react';
import { AuthHeader } from './features/auth/AuthHeader';
import { emptyLinkForm } from './features/links/linkFormDefaults';
import { LinkEditor } from './features/links/LinkEditor';
import { LinksPanel } from './features/links/LinksPanel';
import { createLink, deleteLink, getLinks, login, updateLink } from './lib/api';
import { AuthUser, LinkPayload, ToolLink } from './types';

function App() {
  const [links, setLinks] = useState<ToolLink[]>([]);
  const [token, setToken] = useState(() => localStorage.getItem('portal_token') ?? '');
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('portal_user');
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });
  const [loginForm, setLoginForm] = useState({ email: 'admin@example.com', password: 'Admin123!' });
  const [form, setForm] = useState<LinkPayload>(emptyLinkForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'admin';

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setLinks(await getLinks(isAdmin));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load links');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    void loadLinks();
  }, [loadLinks]);

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
    setForm(emptyLinkForm);
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
      <AuthHeader loginForm={loginForm} user={user} onLogin={handleLogin} onLoginFormChange={setLoginForm} onLogout={logout} />

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[1fr_360px]">
        <LinksPanel error={error} isAdmin={isAdmin} links={links} loading={loading} onDelete={removeLink} onEdit={startEdit} onRefresh={loadLinks} />

        {isAdmin && <LinkEditor editingId={editingId} form={form} onCancel={resetForm} onFormChange={setForm} onSubmit={saveLink} />}
      </section>
    </main>
  );
}

export default App;
