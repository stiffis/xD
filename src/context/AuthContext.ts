import { createContext } from 'react';
import type { AuthResponse } from '../types/type';

export interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (response: AuthResponse) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
