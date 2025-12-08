import axios from 'axios';
import { API_CONFIG } from '@/app/config';

const axiosInstance = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use((config) => {
	const token =
		typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export const subscriptionService = {
	getAllSubscriptions: async () => {
		try {
			const res = await axiosInstance.get('/subscription/get-all');
			return res.data?.data?.subscriptions || [];
		} catch (err) {
			throw new Error('Unable to get subscriptions');
		}
	},
};
