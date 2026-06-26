import { RefreshCcw } from 'lucide-react';
import { ToolLink } from '../../types';
import { LinkCard } from './LinkCard';

interface LinksPanelProps {
  error: string;
  isAdmin: boolean;
  links: ToolLink[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (link: ToolLink) => void;
  onRefresh: () => void;
}

export function LinksPanel({ error, isAdmin, links, loading, onDelete, onEdit, onRefresh }: LinksPanelProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Available Links</h2>
        <button className="icon-button" onClick={onRefresh} title="Refresh links" type="button">
          <RefreshCcw size={18} />
        </button>
      </div>

      {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-md border border-zinc-200 bg-white p-6 text-sm text-zinc-600">Loading links...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {links.map((link) => (
            <LinkCard key={link._id} isAdmin={isAdmin} link={link} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}
