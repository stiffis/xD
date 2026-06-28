import axios from 'axios';
import { BASE_URL } from '../api/axios';
import type { AuthResponse, Credentials } from '../types/type';

export const login = async (data: Credentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/login`, data);
    return response.data;
};

export const register = async (data: Credentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/register`, data);
    return response.data;
};
