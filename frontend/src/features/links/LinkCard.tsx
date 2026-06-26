import { Edit3, ExternalLink, Trash2 } from 'lucide-react';
import { getToolIcon } from '../../lib/toolIcons';
import { ToolLink } from '../../types';

interface LinkCardProps {
  isAdmin: boolean;
  link: ToolLink;
  onDelete: (id: string) => void;
  onEdit: (link: ToolLink) => void;
}

export function LinkCard({ isAdmin, link, onDelete, onEdit }: LinkCardProps) {
  const Icon = getToolIcon(link.icon);

  return (
    <article className="card">
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
            <button className="icon-button" onClick={() => onEdit(link)} title="Edit link" type="button">
              <Edit3 size={18} />
            </button>
            <button className="icon-button danger" onClick={() => onDelete(link._id)} title="Delete link" type="button">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
