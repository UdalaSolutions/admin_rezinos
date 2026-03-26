import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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
