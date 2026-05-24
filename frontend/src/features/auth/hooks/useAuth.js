import { useNavigate } from 'react-router';
import { useAuth } from '../auth.context';
import { login, getUser, logout as logoutApi } from '../auth.api';

export function useHandleLogin() {
	const { setUser, setLoading, setToken } = useAuth();

	const handleLogin = async (email, password) => {
		setLoading(true);
		try {
			const loginData = await login(email, password);

			if (loginData.token) {
				localStorage.setItem('token', loginData.token);
				setToken(loginData.token);
				try {
					const userData = await getUser();
					setUser(userData.user);
				} catch {
					setUser(loginData.user || { email });
				}
			}

			setLoading(false);
			return { success: true };
		} catch (error) {
			setLoading(false);
			return { success: false, error: error.message };
		}
	};

	return handleLogin;
}

export function useLogout() {
	const navigate = useNavigate();
	const { clearSession } = useAuth();

	return async () => {
		try {
			if (localStorage.getItem('token')) {
				await logoutApi();
			}
		} catch {
			/* still clear local session if API fails */
		} finally {
			clearSession();
			navigate('/login', { replace: true });
		}
	};
}
