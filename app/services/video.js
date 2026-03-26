import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getToken = () => {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem('authToken');
};

export const getVideos = async () => {
	const token = getToken();

	const res = await axios.get(`${BASE_URL}/video/get-all`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	return res.data;
};

export const addVideo = async (videoData) => {
	const token = getToken();

	const res = await axios.post(`${BASE_URL}/video/create`, videoData, {
		headers: { Authorization: `Bearer ${token}` },
	});

	return res.data;
};

export const deleteVideo = async (id) => {
	const token = getToken();

	await axios.delete(`${BASE_URL}/video/delete/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	return true;
};
