import { UserRole } from '../users/user-role.enum';

export interface JwtUser {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
}
