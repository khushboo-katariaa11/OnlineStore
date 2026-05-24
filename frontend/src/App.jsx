import { RouterProvider } from 'react-router';
import router from './app.route';
import { AuthProvider } from './features/auth/auth.context';
import { DashboardProvider } from './features/dashboard/dashboard.context';
import { CartProvider } from './features/cart/cart.context';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <DashboardProvider>
          <RouterProvider router={router} />
        </DashboardProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
