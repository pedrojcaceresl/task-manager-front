import apiClient from './api'; // Import your existing API client

import { apiClient as api } from './api'

import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'authToken';

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const login = async (credentials) => {
    try {
        const response = await apiClient.login(credentials);
        const { access, refresh } = response.data;
        setToken(access); // Save access token to local storage
        return response.data;
    } catch (error) {
        console.error('Login failed', error);
        throw error;
    }
};

export const logout = () => {
    removeToken(); // Remove token from local storage
};

export const getCurrentUser = async () => {
    const token = getToken();
    if (!token) {
        return null;
    }

    try {
        // Decode the token to get user info
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id; // Adjust this according to your token's payload

        // Fetch the user details from the API
        const response = await api.get(`/users/${userId}/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user', error);
        throw error;
    }
};

// Function to get user ID from token
export const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        return decoded.user_id; // Adjust this according to your token's payload
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
