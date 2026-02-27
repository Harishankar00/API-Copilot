import axios from 'axios';

// Point this to your FastAPI backend
const API_URL = 'https://harishankar000-specdraft-api.hf.space';
// Create an Axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Automatically attach the Supabase token to every request if the user is logged in
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('supabase_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- API Functions ---

export const signup = async (email, password) => {
    const response = await api.post('/auth/signup', { email, password });
    return response.data;
};

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    // Save the token to local storage so we stay logged in
    if (response.data.session?.access_token) {
        localStorage.setItem('supabase_token', response.data.session.access_token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('supabase_token');
};

export const generateSpecs = async (text, file) => {
    // We use FormData because we might be sending a file OR text
    const formData = new FormData();
    if (text) formData.append('raw_text', text);
    if (file) formData.append('file', file);

    const response = await api.post('/api/generate', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export default api;