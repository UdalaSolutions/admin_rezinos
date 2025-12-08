import axios from 'axios';
import { API_CONFIG } from '@/app/config';

const api = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('authToken');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export const signIn = async (email, password) => {
	try {
		const response = await api.post('/login', { email, password });
		const { token } = response.data;
		localStorage.setItem('authToken', token);
		return token;
	} catch (error) {
		const msg =
			error.response?.data?.message || 'Sign in failed. Please try again.';
		throw new Error(msg);
	}
};

export const signOut = () => {
	localStorage.removeItem('authToken');
};

export const getAuthToken = () => localStorage.getItem('authToken');

export const getAllUsers = async () => {
	try {
		const res = await api.get('/get-all');
		return res.data.data.users || [];
	} catch (error) {
		throw new Error('Unable to fetch users');
	}
};

export const getUserById = async (id) => {
	try {
		const res = await api.get(`/get/${id}`);
		return res.data.data;
	} catch (error) {
		throw new Error('Unable to fetch user');
	}
};
