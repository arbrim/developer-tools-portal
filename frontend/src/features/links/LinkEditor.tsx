import { FormEvent } from 'react';
import { Check, Plus, Save, X } from 'lucide-react';
import { iconOptions } from '../../lib/toolIcons';
import { LinkPayload } from '../../types';

interface LinkEditorProps {
  editingId: string | null;
  form: LinkPayload;
  onCancel: () => void;
  onFormChange: (form: LinkPayload) => void;
  onSubmit: (event: FormEvent) => void;
}

export function LinkEditor({ editingId, form, onCancel, onFormChange, onSubmit }: LinkEditorProps) {
  return (
    <aside className="h-fit rounded-md border border-zinc-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{editingId ? 'Edit Link' : 'Add Link'}</h2>
        {editingId && (
          <button className="icon-button" onClick={onCancel} title="Cancel edit" type="button">
            <X size={18} />
          </button>
        )}
      </div>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="input w-full" value={form.title} onChange={(e) => onFormChange({ ...form, title: e.target.value })} placeholder="Title" />
        <input
          className="input w-full"
          value={form.category}
          onChange={(e) => onFormChange({ ...form, category: e.target.value })}
          placeholder="Category"
        />
        <input className="input w-full" value={form.url} onChange={(e) => onFormChange({ ...form, url: e.target.value })} placeholder="https://..." />
        <textarea
          className="input min-h-24 w-full resize-y"
          value={form.description}
          onChange={(e) => onFormChange({ ...form, description: e.target.value })}
          placeholder="Description"
        />
        <select className="input w-full" value={form.icon} onChange={(e) => onFormChange({ ...form, icon: e.target.value })}>
          {iconOptions.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            checked={form.isActive}
            onChange={(e) => onFormChange({ ...form, isActive: e.target.checked })}
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
          <button className="btn-secondary w-full justify-center" onClick={onCancel} type="button">
            <X size={18} />
            Clear
          </button>
        )}
      </form>
    </aside>
  );
}
