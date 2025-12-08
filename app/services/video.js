import axios from 'axios';
import { API_CONFIG } from '@/app/config';

const api = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Attach token from localStorage to every request
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('authToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

/**
 * Video Service
 */
export const videoService = {
	getVideos: async () => {
		try {
			const res = await api.get('/video/get-all');
			return res.data;
		} catch (err) {
			if (err.response?.data?.message)
				throw new Error(err.response.data.message);
			throw new Error('Failed to fetch videos.');
		}
	},

	addVideo: async (video) => {
		try {
			const res = await api.post('/video/create', video);
			return res.data;
		} catch (err) {
			if (err.response?.data?.message)
				throw new Error(err.response.data.message);
			throw new Error('Failed to add video.');
		}
	},

	deleteVideo: async (id) => {
		try {
			await api.delete(`/video/delete/${id}`);
			return true;
		} catch (err) {
			if (err.response?.data?.message)
				throw new Error(err.response.data.message);
			throw new Error('Failed to delete video.');
		}
	},
};
