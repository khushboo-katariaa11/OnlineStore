import { createBrowserRouter } from 'react-router';

import LoginPage from './features/auth/pages/login';
import HomePage from './features/auth/pages/home';
import DashboardPage from './features/dashboard/pages/dashboard';
import ProtectedRoute from './components/ProtectedRoute';


const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/dashboard',
		element: (
			<ProtectedRoute>
				<DashboardPage />
			</ProtectedRoute>
		),
	}
]);

export default router;