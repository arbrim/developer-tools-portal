import {
  Activity,
  Boxes,
  ExternalLink,
  GitBranch,
  KanbanSquare,
  LucideIcon,
  SearchCode,
  ShieldCheck,
  Workflow,
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  Activity,
  Boxes,
  ExternalLink,
  GitBranch,
  KanbanSquare,
  SearchCode,
  ShieldCheck,
  Workflow,
};

export function getToolIcon(name?: string) {
  return name ? iconMap[name] ?? ExternalLink : ExternalLink;
}

export const iconOptions = Object.keys(iconMap);
