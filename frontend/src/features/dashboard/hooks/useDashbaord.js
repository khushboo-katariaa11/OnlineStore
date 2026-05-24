import { useCallback } from 'react';
import { useDashboardContext } from '../dashboard.context';
import { getAllProducts, addProduct, deleteProduct, getProductById } from '../dashboard.api';

export function useDashboard() {
	const {
		products,
		setProducts,
		loading,
		setLoading,
		error,
		setError,
		totalProducts,
		setTotalProducts,
		currentPage,
		setCurrentPage,
		limit,
		setLimit
	} = useDashboardContext();

	/**
	 * Fetch all products with pagination
	 */
	const handleGetAllProducts = useCallback(
		async (page = 1, pageLimit = 10) => {
			setLoading(true);
			setError(null);
			try {
				const data = await getAllProducts(page, pageLimit);
				setProducts(data.products);
				setTotalProducts(data.total);
				setCurrentPage(data.page);
				setLimit(data.limit);
				return data;
			} catch (err) {
				const errorMessage = err.message || 'Failed to fetch products';
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[setProducts, setTotalProducts, setCurrentPage, setLimit, setLoading, setError]
	);

	/**
	 * Add a new product
	 */
	const handleAddProduct = useCallback(
		async (formData) => {
			setLoading(true);
			setError(null);
			try {
				const newProduct = await addProduct(formData);
				setProducts(prev => [newProduct, ...prev]);
				setTotalProducts(prev => prev + 1);
				return newProduct;
			} catch (err) {
				const errorMessage = err.message || 'Failed to add product';
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[setProducts, setTotalProducts, setLoading, setError]
	);

	/**
	 * Delete a product by ID
	 */
	const handleDeleteProduct = useCallback(
		async (productId) => {
			setLoading(true);
			setError(null);
			try {
				await deleteProduct(productId);
				setProducts(prev => prev.filter(p => p._id !== productId));
				setTotalProducts(prev => Math.max(0, prev - 1));
				return { success: true };
			} catch (err) {
				const errorMessage = err.message || 'Failed to delete product';
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[setProducts, setTotalProducts, setLoading, setError]
	);

	/**
	 * View product details by ID
	 */
	const handleViewProduct = useCallback(
		async (productId) => {
			setLoading(true);
			setError(null);
			try {
				const product = await getProductById(productId);
				return product;
			} catch (err) {
				const errorMessage = err.message || 'Failed to fetch product details';
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[setLoading, setError]
	);

	return {
		// State
		products,
		loading,
		error,
		totalProducts,
		currentPage,
		limit,
		
		// Methods
		handleGetAllProducts,
		handleAddProduct,
		handleDeleteProduct,
		handleViewProduct
	};
}
