import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router';
import { useDashboard } from '../hooks/useDashbaord';
import { useAuth } from '../../auth/auth.context';
import { useLogout } from '../../auth/hooks/useAuth';
import { createProductFormData } from '../dashboard.api';
import { getFullImageUrl, PLACEHOLDER_IMAGE } from '../../../utils/imageUrl';
import { MenuIcon, CloseIcon } from '../../../components/icons';
import './dashboard.css';

const DashboardPage = () => {
	const { token } = useAuth();
	const logout = useLogout();
	const {
		products,
		loading,
		error,
		handleGetAllProducts,
		handleAddProduct,
		handleUpdateProduct,
		handleDeleteProduct,
		handleViewProduct,
	} = useDashboard();

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showAddForm, setShowAddForm] = useState(false);
	const [showEditForm, setShowEditForm] = useState(false);
	const [editingProductId, setEditingProductId] = useState(null);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [showViewModal, setShowViewModal] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const [formError, setFormError] = useState('');

	const [formData, setFormData] = useState({
		category: '',
		subcategory: '',
		name: '',
		price: '',
		description: '',
		colors: '',
		image: null,
	});

	useEffect(() => {
		handleGetAllProducts(1, 12);
	}, [handleGetAllProducts]);

	useEffect(() => {
		document.body.style.overflow = sidebarOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [sidebarOpen]);

	const handleInputChange = (e) => {
		const { name, type, files, value } = e.target;
		if (type === 'file') {
			setFormData((prev) => ({ ...prev, [name]: files[0] }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmitAddProduct = async (e) => {
		e.preventDefault();
		setFormError('');
		setFormLoading(true);

		try {
			if (!formData.category || !formData.name || !formData.price || !formData.description || !formData.colors) {
				setFormError('All fields except subcategory are required');
				setFormLoading(false);
				return;
			}
			if (!formData.image) {
				setFormError('Product image is required');
				setFormLoading(false);
				return;
			}
			if (!token) {
				setFormError('You must be logged in to add products');
				setFormLoading(false);
				return;
			}

			const data = createProductFormData(formData, formData.image);
			await handleAddProduct(data);

			setFormData({
				category: '',
				subcategory: '',
				name: '',
				price: '',
				description: '',
				colors: '',
				image: null,
			});
			setShowAddForm(false);
		} catch (err) {
			setFormError(err.message || 'Failed to add product');
		} finally {
			setFormLoading(false);
		}
	};

	const handleEditClick = async (productId) => {
		try {
			const product = await handleViewProduct(productId);
			setFormData({
				category: product.category,
				subcategory: product.subcategory || '',
				name: product.name,
				price: product.price,
				description: product.description,
				colors: Array.isArray(product.colors) ? product.colors.join(', ') : product.colors,
				image: null,
			});
			setEditingProductId(productId);
			setShowEditForm(true);
			setFormError('');
		} catch (err) {
			alert(`Failed to load product: ${err.message}`);
		}
	};

	const handleSubmitEditProduct = async (e) => {
		e.preventDefault();
		setFormError('');
		setFormLoading(true);

		try {
			if (!formData.category || !formData.name || !formData.price || !formData.description || !formData.colors) {
				setFormError('All fields except subcategory are required');
				setFormLoading(false);
				return;
			}
			if (!token) {
				setFormError('You must be logged in to update products');
				setFormLoading(false);
				return;
			}

			const data = createProductFormData(formData, formData.image);
			await handleUpdateProduct(editingProductId, data);

			setFormData({
				category: '',
				subcategory: '',
				name: '',
				price: '',
				description: '',
				colors: '',
				image: null,
			});
			setShowEditForm(false);
			setEditingProductId(null);
		} catch (err) {
			setFormError(err.message || 'Failed to update product');
		} finally {
			setFormLoading(false);
		}
	};

	const handleCloseEditForm = () => {
		setShowEditForm(false);
		setEditingProductId(null);
		setFormData({
			category: '',
			subcategory: '',
			name: '',
			price: '',
			description: '',
			colors: '',
			image: null,
		});
		setFormError('');
	};

	const handleDeleteClick = async (productId) => {
		if (!window.confirm('Delete this product?')) return;
		if (!token) return;
		try {
			await handleDeleteProduct(productId);
		} catch (err) {
			alert(`Failed to delete: ${err.message}`);
		}
	};

	const handleViewClick = async (productId) => {
		try {
			const product = await handleViewProduct(productId);
			setSelectedProduct(product);
			setShowViewModal(true);
		} catch (err) {
			alert(`Failed to load product: ${err.message}`);
		}
	};

	const closeSidebar = useCallback(() => setSidebarOpen(false), []);

	return (
		<div className="dashboard">
			{sidebarOpen && (
				<button
					type="button"
					className="dashboard-overlay"
					aria-label="Close menu"
					onClick={closeSidebar}
				/>
			)}

			<aside className={`dashboard-sidebar ${sidebarOpen ? 'dashboard-sidebar--open' : ''}`}>
				<div className="dashboard-sidebar__header">
					<Link to="/" className="dashboard-sidebar__logo" onClick={closeSidebar}>
						WomenHub
					</Link>
					<button
						type="button"
						className="dashboard-sidebar__close"
						onClick={closeSidebar}
						aria-label="Close menu"
					>
						<CloseIcon />
					</button>
				</div>

				<nav className="dashboard-sidebar__nav">
					<span className="dashboard-sidebar__nav-item dashboard-sidebar__nav-item--active">
						Products
					</span>
				</nav>

				<div className="dashboard-sidebar__actions">
					<button
						type="button"
						className="dashboard-btn dashboard-btn--accent"
						onClick={() => {
							setShowAddForm(true);
							closeSidebar();
						}}
					>
						+ Add Product
					</button>
					<Link to="/" className="dashboard-btn dashboard-btn--ghost" onClick={closeSidebar}>
						View Store
					</Link>
					<button type="button" className="dashboard-btn dashboard-btn--ghost" onClick={logout}>
						Sign out
					</button>
				</div>
			</aside>

			<div className="dashboard-main">
				<header className="dashboard-topbar">
					<button
						type="button"
						className="dashboard-menu-btn"
						onClick={() => setSidebarOpen(true)}
						aria-label="Open menu"
					>
						<MenuIcon />
					</button>
					<h1 className="dashboard-topbar__title">Products</h1>
					<button
						type="button"
						className="dashboard-btn dashboard-btn--primary dashboard-topbar__add"
						onClick={() => setShowAddForm(true)}
					>
						+ Add
					</button>
				</header>

				<div className="dashboard-content">
					{error && (
						<div className="dashboard-alert" role="alert">
							{error}
						</div>
					)}

					{loading && !products.length ? (
						<div className="dashboard-loading">
							<div className="dashboard-spinner" />
							<p>Loading products…</p>
						</div>
					) : products.length === 0 ? (
						<div className="dashboard-empty">
							<h3>No products yet</h3>
							<p>Add your first product to populate the store.</p>
							<button
								type="button"
								className="dashboard-btn dashboard-btn--primary"
								onClick={() => setShowAddForm(true)}
							>
								Add Product
							</button>
						</div>
					) : (
						<div className="dashboard-grid">
							{products.map((product) => (
								<article key={product._id} className="dashboard-card">
									<div className="dashboard-card__image">
										<img
											src={getFullImageUrl(product.image)}
											alt={product.name}
											loading="lazy"
											onError={(e) => {
												e.target.src = PLACEHOLDER_IMAGE;
											}}
										/>
									</div>
									<div className="dashboard-card__body">
										<h3>{product.name}</h3>
										<span className="dashboard-card__badge">{product.category}</span>
										<p className="dashboard-card__desc">
											{product.description.length > 72
												? `${product.description.slice(0, 72)}…`
												: product.description}
										</p>
										<p className="dashboard-card__price">
											₹{Number(product.price).toLocaleString('en-IN')}
										</p>
									</div>
									<div className="dashboard-card__actions">
										<button
											type="button"
											className="dashboard-btn dashboard-btn--sm dashboard-btn--ghost"
											onClick={() => handleViewClick(product._id)}
										>
											View
										</button>
										<button
											type="button"
											className="dashboard-btn dashboard-btn--sm dashboard-btn--primary"
											onClick={() => handleEditClick(product._id)}
										>
											Edit
										</button>
										<button
											type="button"
											className="dashboard-btn dashboard-btn--sm dashboard-btn--danger"
											onClick={() => handleDeleteClick(product._id)}
										>
											Delete
										</button>
									</div>
								</article>
							))}
						</div>
					)}
				</div>
			</div>

			{showAddForm && (
				<div className="dashboard-modal-overlay" onClick={() => setShowAddForm(false)}>
					<div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
						<div className="dashboard-modal__header">
							<h2>Add Product</h2>
							<button
								type="button"
								className="dashboard-modal__close"
								onClick={() => setShowAddForm(false)}
								aria-label="Close"
							>
								<CloseIcon />
							</button>
						</div>
						{formError && <div className="dashboard-alert">{formError}</div>}
						<form onSubmit={handleSubmitAddProduct} className="dashboard-form">
							<div className="dashboard-form__field">
								<label>Category *</label>
								<input
									type="text"
									name="category"
									value={formData.category}
									onChange={handleInputChange}
									placeholder="e.g. Clothing"
									disabled={formLoading}
									required
								/>
							</div>
							<div className="dashboard-form__field">
								<label>Subcategory</label>
								<input
									type="text"
									name="subcategory"
									value={formData.subcategory}
									onChange={handleInputChange}
									placeholder="e.g. Dresses"
									disabled={formLoading}
								/>
							</div>
							<div className="dashboard-form__field">
								<label>Name *</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									disabled={formLoading}
									required
								/>
							</div>
							<div className="dashboard-form__field">
								<label>Price *</label>
								<input
									type="number"
									name="price"
									value={formData.price}
									onChange={handleInputChange}
									step="0.01"
									min="0"
									disabled={formLoading}
									required
								/>
							</div>
							<div className="dashboard-form__field">
								<label>Description *</label>
								<textarea
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									rows={3}
									disabled={formLoading}
									required
								/>
							</div>
							<div className="dashboard-form__field">
								<label>Colors (comma separated) *</label>
								<input
									type="text"
									name="colors"
									value={formData.colors}
									onChange={handleInputChange}
									placeholder="Red, Blue, Green"
									disabled={formLoading}
									required
								/>
							</div>
							<div className="dashboard-form__field">
								<label>Image *</label>
								<input
									type="file"
									name="image"
									onChange={handleInputChange}
									accept="image/*"
									disabled={formLoading}
									required
								/>
							</div>
							<div className="dashboard-form__actions">
								<button
									type="submit"
									className="dashboard-btn dashboard-btn--primary"
									disabled={formLoading}
								>
									{formLoading ? 'Adding…' : 'Add Product'}
								</button>
								<button
									type="button"
									className="dashboard-btn dashboard-btn--ghost"
									onClick={() => setShowAddForm(false)}
									disabled={formLoading}
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{showViewModal && selectedProduct && (
				<div className="dashboard-modal-overlay" onClick={() => setShowViewModal(false)}>
					<div className="dashboard-modal dashboard-modal--wide" onClick={(e) => e.stopPropagation()}>
						<div className="dashboard-modal__header">
							<h2>{selectedProduct.name}</h2>
							<button
								type="button"
								className="dashboard-modal__close"
								onClick={() => setShowViewModal(false)}
								aria-label="Close"
							>
								<CloseIcon />
							</button>
						</div>
						<div className="dashboard-view">
							<img
								src={getFullImageUrl(selectedProduct.image)}
								alt={selectedProduct.name}
								className="dashboard-view__img"
							/>
							<div className="dashboard-view__details">
								<p>
									<strong>Category:</strong> {selectedProduct.category}
								</p>
								{selectedProduct.subcategory && (
									<p>
										<strong>Subcategory:</strong> {selectedProduct.subcategory}
									</p>
								)}
								<p>
									<strong>Price:</strong> ₹
									{Number(selectedProduct.price).toLocaleString('en-IN')}
								</p>
								<p>
									<strong>Description:</strong> {selectedProduct.description}
								</p>
								<p>
									<strong>Colors:</strong>{' '}
									{Array.isArray(selectedProduct.colors)
										? selectedProduct.colors.join(', ')
										: selectedProduct.colors}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{showEditForm && (
				<div className="dashboard-modal-overlay" onClick={handleCloseEditForm}>
					<div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
						<div className="dashboard-modal__header">
							<h2>Edit Product</h2>
							<button
								type="button"
								className="dashboard-modal__close"
								onClick={handleCloseEditForm}
								aria-label="Close"
							>
								<CloseIcon />
							</button>
						</div>
						{formError && <div className="dashboard-alert">{formError}</div>}
						<form onSubmit={handleSubmitEditProduct} className="dashboard-form">
							<div className="dashboard-form__field">
								<label>Category *</label>
								<input
									type="text"
									name="category"
									value={formData.category}
									onChange={handleInputChange}
									placeholder="e.g. Clothing"
									disabled={formLoading}
									required
								/>
							</div>
							<div className="dashboard-form__field">
								<label>Subcategory</label>
								<input
									type="text"
									name="subcategory"
									value={formData.subcategory}
									onChange={handleInputChange}
									placeholder="e.g. Dresses"
									disabled={formLoading}
								/>
							</div>
							<div className="dashboard-form__field">
								<label>Name *</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									disabled={formLoading}
									required
								/>
							</div>
							<div className="dashboard-form__field">
								<label>Price *</label>
								<input
									type="number"
									name="price"
									value={formData.price}
									onChange={handleInputChange}
									step="0.01"
									min="0"
									disabled={formLoading}
									required
								/>
							</div>
							<div className="dashboard-form__field">
								<label>Description *</label>
								<textarea
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									rows={3}
									disabled={formLoading}
									required
								/>
							</div>
							<div className="dashboard-form__field">
								<label>Colors (comma separated) *</label>
								<input
									type="text"
									name="colors"
									value={formData.colors}
									onChange={handleInputChange}
									placeholder="Red, Blue, Green"
									disabled={formLoading}
									required
								/>
							</div>
							<div className="dashboard-form__field">
								<label>Image (leave empty to keep current image)</label>
								<input
									type="file"
									name="image"
									onChange={handleInputChange}
									accept="image/*"
									disabled={formLoading}
								/>
							</div>
							<div className="dashboard-form__actions">
								<button
									type="submit"
									className="dashboard-btn dashboard-btn--primary"
									disabled={formLoading}
								>
									{formLoading ? 'Updating…' : 'Update Product'}
								</button>
								<button
									type="button"
									className="dashboard-btn dashboard-btn--ghost"
									onClick={handleCloseEditForm}
									disabled={formLoading}
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default DashboardPage;
