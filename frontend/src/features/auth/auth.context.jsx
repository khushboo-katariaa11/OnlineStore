import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUser } from './auth.api';

const AuthContext = createContext();

const getSavedToken = () => {
	try {
		return localStorage.getItem('token');
	} catch {
		return null;
	}
};

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(false);
	const [authReady, setAuthReady] = useState(false);

	const clearSession = useCallback(() => {
		localStorage.removeItem('token');
		setToken(null);
		setUser(null);
	}, []);

	useEffect(() => {
		let cancelled = false;

		const bootstrap = async () => {
			const saved = getSavedToken();
			if (!saved) {
				if (!cancelled) setAuthReady(true);
				return;
			}

			setToken(saved);
			try {
				const data = await getUser();
				if (!cancelled) {
					setUser(data.user);
				}
			} catch {
				if (!cancelled) clearSession();
			} finally {
				if (!cancelled) setAuthReady(true);
			}
		};

		bootstrap();
		return () => {
			cancelled = true;
		};
	}, [clearSession]);

	useEffect(() => {
		const onForcedLogout = () => clearSession();
		window.addEventListener('auth:logout', onForcedLogout);
		return () => window.removeEventListener('auth:logout', onForcedLogout);
	}, [clearSession]);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				token,
				setToken,
				loading,
				setLoading,
				authReady,
				clearSession,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
