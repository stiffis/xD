import React, { type ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';
import type { AuthResponse } from '../types/type';
import api from '../api/axios';

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('accessToken').then((token) => {
            if (token) setAccessToken(token);
            setLoading(false);
        });
    }, []);

    const login = async (response: AuthResponse) => {
        await AsyncStorage.setItem('accessToken', response.accessToken);
        await AsyncStorage.setItem('refreshToken', response.refreshToken);
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
    };

    const logout = async () => {
        const rt = refreshToken ?? await AsyncStorage.getItem('refreshToken');
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        setAccessToken(null);
        setRefreshToken(null);
        if (rt) {
            try {
                await api.post('/auth/logout', { refreshToken: rt });
            } catch {}
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
