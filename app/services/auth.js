import axios from 'axios';
import { API_CONFIG } from '@/app/config';

const getToken = () => {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem('authToken');
};

//
// AUTH
//
export const signIn = async (email, password) => {
	const res = await axios.post(`${API_CONFIG.BASE_URL}/login`, {
		email,
		password,
	});

	const token = res.data?.data?.token;

	if (token) {
		localStorage.setItem('authToken', token);
	}

	return token;
};

export const signOut = () => {
	localStorage.removeItem('authToken');
};

export const getAuthToken = () => getToken();

//
// USERS
//
export const getAllUsers = async () => {
	const token = getToken();

	const res = await axios.get(`${API_CONFIG.BASE_URL}/get-all`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	return res.data?.data?.users || [];
};

export const getUserById = async (id) => {
	const token = getToken();

	const res = await axios.get(`${API_CONFIG.BASE_URL}/get/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	return res.data?.data || null;
};
