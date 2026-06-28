import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigateToLogin } from '../navigation/navigationRef';

export const BASE_URL = 'http://10.0.2.2:8080/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
                const { accessToken, refreshToken: newRefreshToken } = response.data;

                await AsyncStorage.setItem('accessToken', accessToken);
                await AsyncStorage.setItem('refreshToken', newRefreshToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch {
                await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
                navigateToLogin();
                throw error;
            }
        }
        throw error;
    }
);

export default api;
