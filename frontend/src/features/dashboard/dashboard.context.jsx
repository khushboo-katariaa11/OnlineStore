import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [totalProducts, setTotalProducts] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(10);

	const value = {
		// Products state
		products,
		setProducts,
		
		// Loading state
		loading,
		setLoading,
		
		// Error state
		error,
		setError,
		
		// Pagination state
		totalProducts,
		setTotalProducts,
		currentPage,
		setCurrentPage,
		limit,
		setLimit
	};

	return (
		<DashboardContext.Provider value={value}>
			{children}
		</DashboardContext.Provider>
	);
}

export function useDashboardContext() {
	const context = useContext(DashboardContext);
	if (!context) {
		throw new Error('useDashboardContext must be used within DashboardProvider');
	}
	return context;
}
