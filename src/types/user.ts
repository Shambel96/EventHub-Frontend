export type UserRole = 'owner' | 'admin' | 'user';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  joinedDate: string;
  status: UserStatus;
  bio?: string;
  location?: string;
  totalEventsAttended: number;
}
