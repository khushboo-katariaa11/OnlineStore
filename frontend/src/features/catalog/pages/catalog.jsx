import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCart } from '../../cart/cart.context';
import Layout from '../../../components/Layout';
import CartDrawer, { Toast } from '../../../components/CartDrawer';
import ProductModal from '../components/ProductModal';
import DeptCard from '../components/DeptCard';
import {
	getCategories,
	getSubcategories,
	getProductsByCategory,
	getAllProducts,
} from '../catalog.api';
import { SHOP, SHOP_IMAGES, SHOP_DEPARTMENTS, matchCategoryForDepartment } from '../../../config/shopTheme';
import { getFullImageUrl, PLACEHOLDER_IMAGE } from '../../../utils/imageUrl';
import './catalog.css';

const CatalogPage = () => {
	const { getCartCount, addToCart } = useCart();
	const mapContainer = useRef(null);

	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [subcategories, setSubcategories] = useState([]);
	const [selectedSubcategory, setSelectedSubcategory] = useState('');
	const [products, setProducts] = useState([]);
	const [totalProducts, setTotalProducts] = useState(0);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const [loadingProducts, setLoadingProducts] = useState(true);
	const [error, setError] = useState('');
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [showProductModal, setShowProductModal] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const [toast, setToast] = useState({ message: '', visible: false });

	const showToast = useCallback((message) => {
		setToast({ message, visible: true });
		const t = setTimeout(() => setToast({ message: '', visible: false }), 2500);
		return () => clearTimeout(t);
	}, []);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				setLoadingCategories(true);
				setError('');
				const cats = await getCategories();
				if (!cancelled) setCategories(cats);
			} catch {
				if (!cancelled) setError('Failed to load categories. Please refresh the page.');
			} finally {
				if (!cancelled) setLoadingCategories(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (!mapContainer.current) return;

		// Initialize map on store location: 28.5244°N, 77.1253°E
		const map = window.L.map(mapContainer.current).setView([28.5244, 77.1253], 15);

		// Add OpenStreetMap tiles
		window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19,
		}).addTo(map);

		// Add marker at shop location
		window.L.marker([28.5244, 77.1253])
			.bindPopup(
				`<div style="font-family: DM Sans, sans-serif; font-size: 14px;">
					<strong style="color: #8b2942; font-size: 16px;">WomenHub</strong><br/>
					WZ-3/1 Plot 17<br/>
					Vishnu Garden<br/>
					New Delhi 110018<br/>
					<strong style="color: #8b2942;">📞 +91 83681 67140</strong>
				</div>`
			)
			.addTo(map)
			.openPopup();

		return () => {
			map.remove();
		};
	}, []);

	useEffect(() => {
		if (!selectedCategory) {
			setSubcategories([]);
			return;
		}

		let cancelled = false;
		(async () => {
			try {
				const subs = await getSubcategories(selectedCategory);
				if (!cancelled) setSubcategories(subs.filter(Boolean));
			} catch {
				if (!cancelled) setError('Failed to load subcategories.');
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [selectedCategory]);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoadingProducts(true);
			setError('');
			try {
				if (selectedCategory) {
					const result = await getProductsByCategory(
						selectedCategory,
						selectedSubcategory,
						1,
						48
					);
					if (!cancelled) {
						setProducts(result.products || []);
						setTotalProducts(result.total ?? result.products?.length ?? 0);
					}
				} else {
					const result = await getAllProducts(1, 48);
					if (!cancelled) {
						setProducts(result.products || []);
						setTotalProducts(result.total ?? result.products?.length ?? 0);
					}
				}
			} catch {
				if (!cancelled) setError('Failed to load products.');
			} finally {
				if (!cancelled) setLoadingProducts(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [selectedCategory, selectedSubcategory]);

	const handleCategorySelect = (category) => {
		setSelectedCategory(category);
		if (!category) setSelectedSubcategory('');
	};

	const handleDepartmentClick = (department) => {
		const matched = matchCategoryForDepartment(categories, department);
		if (matched) {
			setSelectedCategory(matched);
		} else {
			setSelectedCategory(null);
			document.getElementById('shop-products')?.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const handleProductClick = (product) => {
		setSelectedProduct(product);
		setShowProductModal(true);
	};

	const handleAddToCart = useCallback(
		(product) => {
			addToCart(product);
			showToast(`${product.name} added to cart`);
		},
		[addToCart, showToast]
	);

	const closeProductModal = () => {
		setShowProductModal(false);
		setTimeout(() => setSelectedProduct(null), 280);
	};

	const productsHeading = selectedCategory
		? selectedSubcategory
			? `${selectedCategory} · ${selectedSubcategory}`
			: selectedCategory
		: 'All Products';

	const renderCategoryFilters = () => (
		<>
			<button
				type="button"
				role="tab"
				aria-selected={!selectedCategory}
				className={`category-chip ${!selectedCategory ? 'category-chip--active' : ''}`}
				onClick={() => handleCategorySelect(null)}
			>
				All
			</button>
			{categories.map((category) => (
				<button
					key={category}
					type="button"
					role="tab"
					aria-selected={selectedCategory === category}
					className={`category-chip ${selectedCategory === category ? 'category-chip--active' : ''}`}
					onClick={() => handleCategorySelect(category)}
				>
					{category}
				</button>
			))}
		</>
	);

	const renderProductGrid = () => {
		if (loadingProducts) {
			return (
				<div className="products-skeleton" aria-busy="true" aria-label="Loading products">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="skeleton-card" />
					))}
				</div>
			);
		}

		if (products.length === 0) {
			return (
				<div className="catalog-empty">
					<p>No products listed yet. Check back soon or contact us on WhatsApp.</p>
				</div>
			);
		}

		return (
			<div className="products-grid">
				{products.map((product) => (
					<article key={product._id} className="product-card">
						<button
							type="button"
							className="product-card__media"
							onClick={() => handleProductClick(product)}
						>
							<img
								src={getFullImageUrl(product.image)}
								alt={product.name}
								className="product-card__img"
								loading="lazy"
								onError={(e) => {
									e.target.src = PLACEHOLDER_IMAGE;
								}}
							/>
							<span className="product-card__view">View</span>
						</button>
						<div className="product-card__body">
							<h3 className="product-card__name">{product.name}</h3>
							<p className="product-card__meta">{product.category}</p>
							<div className="product-card__footer">
								<p className="product-card__price">
									₹{Number(product.price).toLocaleString('en-IN')}
								</p>
								<button
									type="button"
									className="product-card__add"
									onClick={() => handleAddToCart(product)}
									aria-label={`Add ${product.name} to cart`}
								>
									Add to Cart
								</button>
							</div>
						</div>
					</article>
				))}
			</div>
		);
	};

	return (
		<Layout
			onCartClick={() => setCartOpen(true)}
			cartCount={getCartCount()}
			variant="store"
		>
			<div className="catalog-page">
				<section className="catalog-hero">
					<img
						className="catalog-hero__bg"
						src={SHOP_IMAGES.hero}
						alt=""
						aria-hidden
						loading="eager"
						decoding="async"
						fetchPriority="high"
					/>
					<div className="catalog-hero__overlay" aria-hidden />
					<div className="catalog-hero__inner">
						<p className="catalog-hero__eyebrow">{SHOP.tagline}</p>
						<h1 className="catalog-hero__title">{SHOP.name}</h1>
						<p className="catalog-hero__subtitle">{SHOP.description}</p>
					</div>
				</section>

				<section className="shop-departments" aria-label="Shop departments">
					<div className="shop-departments__wrap">
						<header className="shop-departments__header">
							<p className="shop-departments__eyebrow">Collections</p>
							<h2 className="shop-departments__title">Shop by department</h2>
						</header>
						<div className="shop-departments__inner">
							{SHOP_DEPARTMENTS.map((dept) => (
								<DeptCard
									key={dept.key}
									department={dept}
									onClick={() => handleDepartmentClick(dept)}
								/>
							))}
						</div>
					</div>
				</section>

				<div className="catalog-page__body">
					{error && (
						<div className="catalog-alert" role="alert">
							{error}
						</div>
					)}

					<div className="category-scroll-wrap">
						<div className="category-scroll" role="tablist" aria-label="Categories">
							{loadingCategories ? (
								<span className="category-scroll__loading">Loading…</span>
							) : (
								renderCategoryFilters()
							)}
						</div>
					</div>

					<div className="catalog-layout">
						<aside className="catalog-sidebar" aria-label="Categories">
							<h2 className="catalog-sidebar__title">Browse</h2>
							{loadingCategories ? (
								<p className="catalog-sidebar__loading">Loading…</p>
							) : (
								<ul className="catalog-sidebar__list">
									<li>
										<button
											type="button"
											className={`catalog-sidebar__btn ${!selectedCategory ? 'catalog-sidebar__btn--active' : ''}`}
											onClick={() => handleCategorySelect(null)}
										>
											All Products
										</button>
									</li>
									{categories.map((category) => (
										<li key={category}>
											<button
												type="button"
												className={`catalog-sidebar__btn ${selectedCategory === category ? 'catalog-sidebar__btn--active' : ''}`}
												onClick={() => handleCategorySelect(category)}
											>
												{category}
											</button>
										</li>
									))}
								</ul>
							)}
						</aside>

						<div className="catalog-main" id="shop-products">
							<div className="catalog-main__head">
								<h2 className="catalog-main__title">{productsHeading}</h2>
								{!loadingProducts && totalProducts > 0 && (
									<span className="catalog-main__count">{totalProducts} items</span>
								)}
							</div>

							{selectedCategory && subcategories.length > 0 && (
								<div className="subcategory-scroll">
									<button
										type="button"
										className={`subcategory-chip ${selectedSubcategory === '' ? 'subcategory-chip--active' : ''}`}
										onClick={() => setSelectedSubcategory('')}
									>
										All
									</button>
									{subcategories.map((sub) => (
										<button
											key={sub}
											type="button"
											className={`subcategory-chip ${selectedSubcategory === sub ? 'subcategory-chip--active' : ''}`}
											onClick={() => setSelectedSubcategory(sub)}
										>
											{sub}
										</button>
									))}
								</div>
							)}

							{renderProductGrid()}
						</div>
					</div>
				</div>
			</div>

			<section className="contact-section" aria-label="Contact us">
				<div className="contact-section__wrap">
					<div className="contact-section__header">
						<h2 className="contact-section__title">Get in Touch</h2>
						<p className="contact-section__subtitle">We'd love to hear from you! Reach out via WhatsApp or visit our store.</p>
						<div className="contact-section__accent-bar" />
					</div>
					
					<div className="contact-section__grid">
						<div className="contact-card contact-card--whatsapp">
							<div className="contact-card__icon">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
									<path d="M9 10h.01M13 10h.01" />
									<path d="M11 14h.01" />
								</svg>
							</div>
							<h3 className="contact-card__heading">Quick Chat</h3>
							<p className="contact-card__description">Message us on WhatsApp for instant replies and product information</p>
							<a 
								href={`https://wa.me/${SHOP.whatsappNumber}?text=Hi%20WomenHub%2C%20I%20have%20a%20question%20about%20your%20products`}
								target="_blank"
								rel="noopener noreferrer"
								className="contact-card__button"
							>
								Open WhatsApp
							</a>
						</div>

						<div className="contact-card contact-card--address">
							<div className="contact-card__icon">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
									<circle cx="12" cy="10" r="3" />
								</svg>
							</div>
							<h3 className="contact-card__heading">Visit Our Store</h3>
							<p className="contact-card__description">{SHOP.address}</p>
							<p className="contact-card__phone">{SHOP.phone}</p>
						</div>
					</div>

					<div className="contact-section__map-container">
						<div className="contact-section__map" ref={mapContainer} />
					</div>
				</div>
			</section>
			<Toast message={toast.message} visible={toast.visible} />

			{showProductModal && selectedProduct && (
				<ProductModal
					product={selectedProduct}
					onClose={closeProductModal}
					onAddToCart={handleAddToCart}
				/>
			)}
		</Layout>
	);
};

export default CatalogPage;
