import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CART_STORAGE_KEY = 'womenhub_cart';

const CartContext = createContext();

function loadCartFromStorage() {
	try {
		const raw = localStorage.getItem(CART_STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) return parsed;
		}
	} catch {
		/* ignore */
	}
	return [];
}

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState(loadCartFromStorage);

	useEffect(() => {
		try {
			localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
		} catch {
			/* ignore */
		}
	}, [cartItems]);

	const addToCart = useCallback((product) => {
		setCartItems((prev) => {
			const existingItem = prev.find((item) => item._id === product._id);
			if (existingItem) {
				return prev.map((item) =>
					item._id === product._id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			}
			return [...prev, { ...product, quantity: 1 }];
		});
	}, []);

	const removeFromCart = useCallback((productId) => {
		setCartItems((prev) => prev.filter((item) => item._id !== productId));
	}, []);

	const updateQuantity = useCallback(
		(productId, quantity) => {
			if (quantity <= 0) {
				setCartItems((prev) => prev.filter((item) => item._id !== productId));
				return;
			}
			setCartItems((prev) =>
				prev.map((item) =>
					item._id === productId ? { ...item, quantity } : item
				)
			);
		},
		[]
	);

	const clearCart = useCallback(() => {
		setCartItems([]);
	}, []);

	const getCartTotal = useCallback(() => {
		return cartItems.reduce(
			(total, item) => total + Number(item.price) * item.quantity,
			0
		);
	}, [cartItems]);

	const getCartCount = useCallback(() => {
		return cartItems.reduce((count, item) => count + item.quantity, 0);
	}, [cartItems]);

	const value = {
		cartItems,
		addToCart,
		removeFromCart,
		updateQuantity,
		clearCart,
		getCartTotal,
		getCartCount,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error('useCart must be used within CartProvider');
	}
	return context;
};
