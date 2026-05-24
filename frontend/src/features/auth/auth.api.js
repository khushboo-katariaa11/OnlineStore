import api from '../../lib/api';

export async function login(email, password) {
	try {
		const response = await api.post('/admin/login', { email, password });
		return response.data;
	} catch (error) {
		const message =
			error.response?.data?.message || 'Login failed. Please try again.';
		throw new Error(message);
	}
}

export async function getUser() {
	try {
		const response = await api.get('/admin/user');
		return response.data;
	} catch (error) {
		const message =
			error.response?.data?.message || 'Failed to fetch user.';
		throw new Error(message);
	}
}

export async function logout() {
	try {
		await api.post('/admin/logout');
	} catch (error) {
		const message =
			error.response?.data?.message || 'Logout failed.';
		throw new Error(message);
	}
}
