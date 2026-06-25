export type UserRole = 'user' | 'admin';

export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface ToolLink {
  _id: string;
  title: string;
  category: string;
  url: string;
  description: string;
  icon?: string;
  isActive: boolean;
}

export type LinkPayload = Omit<ToolLink, '_id'>;
