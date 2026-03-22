import axios from 'axios';
import { API_CONFIG } from '../config';

const getToken = () => {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem('authToken');
};

export const getVideos = async () => {
	const token = getToken();

	const res = await axios.get(`${API_CONFIG.BASE_URL}/video/get-all`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	return res.data;
};

export const addVideo = async (videoData) => {
	const token = getToken();

	const res = await axios.post(
		`${API_CONFIG.BASE_URL}/video/create`,
		videoData,
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);

	return res.data;
};

export const deleteVideo = async (id) => {
	const token = getToken();

	await axios.delete(`${API_CONFIG.BASE_URL}/video/delete/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	return true;
};
