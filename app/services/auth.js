import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getToken = () => {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem('authToken');
};

//
// AUTH
//
export const signIn = async (email, password) => {
	const res = await axios.post(`${BASE_URL}/login`, {
		email,
		password,
		userType: 'ADMIN',
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
// REGISTRATION FLOW
//

// Step 1: Send OTP to email (body is a raw JSON string e.g. "user@example.com")
export const sendOtp = async (email) => {
	const res = await axios.post(`${BASE_URL}/otp/send`, JSON.stringify(email), {
		headers: { 'Content-Type': 'application/json' },
	});
	return res.data;
};

// Step 2: Verify OTP (query params)
export const verifyOtp = async (email, code) => {
	const res = await axios.post(`${BASE_URL}/otp/verify`, null, {
		params: { recipient: email, code },
	});
	return res.data;
};

// Step 3: Register admin account
export const registerAdmin = async ({
	firstName,
	lastName,
	email,
	password,
}) => {
	const res = await axios.post(`${BASE_URL}/register`, {
		firstName,
		lastName,
		email,
		password,
		userType: 'ADMIN',
	});
	return res.data;
};

//
// PASSWORD RESET FLOW
//
export const requestPasswordReset = async (email) => {
	const res = await axios.post(`${BASE_URL}/password/request`, null, {
		params: { recipient: email },
	});
	return res.data;
};

export const resetPassword = async ({ email, code, newPassword }) => {
	const res = await axios.post(`${BASE_URL}/password/reset`, {
		email,
		code,
		newPassword,
	});
	return res.data;
};

//
// USERS
//
export const getAllUsers = async () => {
	const token = getToken();

	const res = await axios.get(`${BASE_URL}/get-all`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	return res.data?.data?.users || [];
};

export const getUserById = async (id) => {
	const token = getToken();

	const res = await axios.get(`${BASE_URL}/get/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	return res.data?.data || null;
};
