export interface User {
  id?: number;
  username: string;
  email: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  username: string;
  roles: string[];
  type: string;
  id: number;
}
