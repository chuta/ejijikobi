export type User = {
  id: string;
  name: string;
  email: string | null;
  avatar?: string;
  phone?: string;
  created_at?: string;
  last_sign_in_at?: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type AuthContextType = AuthState & {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loginWithSocial: (provider: 'google') => Promise<void>;
}; 