import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../features/auth/auth.context';

const ProtectedRoute = ({ children }) => {
	const { token, authReady } = useAuth();

	if (!authReady) {
		return (
			<div className="auth-loading" role="status" aria-live="polite">
				<div className="auth-loading__spinner" />
				<p>Checking session…</p>
			</div>
		);
	}

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default ProtectedRoute;
