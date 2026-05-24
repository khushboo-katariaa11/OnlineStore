import React, { useEffect } from 'react';
import { getFullImageUrl, PLACEHOLDER_IMAGE } from '../../../utils/imageUrl';
import { CloseIcon } from '../../../components/icons';
import './product-modal.css';

const ProductModal = ({ product, onClose, onAddToCart }) => {
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === 'Escape') onClose();
		};
		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', onKey);
		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', onKey);
		};
	}, [onClose]);

	if (!product) return null;

	const handleAddToCart = () => {
		onAddToCart?.(product);
	};

	return (
		<div className="product-modal-overlay" onClick={onClose} role="presentation">
			<div
				className="product-modal"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby="product-modal-title"
			>
				<button type="button" className="product-modal__close" onClick={onClose} aria-label="Close">
					<CloseIcon />
				</button>

				<div className="product-modal__body">
					<div className="product-modal__image-wrap">
						<img
							src={getFullImageUrl(product.image)}
							alt={product.name}
							className="product-modal__image"
							onError={(e) => {
								e.target.src = PLACEHOLDER_IMAGE;
							}}
						/>
					</div>

					<div className="product-modal__details">
						<h2 id="product-modal-title" className="product-modal__name">
							{product.name}
						</h2>

						<div className="product-modal__badges">
							<span className="badge badge--category">{product.category}</span>
							{product.subcategory && (
								<span className="badge badge--sub">{product.subcategory}</span>
							)}
						</div>

						<p className="product-modal__price">
							₹{Number(product.price).toLocaleString('en-IN')}
						</p>

						<p className="product-modal__description">{product.description}</p>

						{product.colors?.length > 0 && (
							<div className="product-modal__colors">
								<h3 className="product-modal__colors-title">Available colors</h3>
								<div className="product-modal__colors-list">
									{product.colors.map((color, index) => (
										<span key={index} className="color-pill">
											{color}
										</span>
									))}
								</div>
							</div>
						)}

						<button type="button" className="product-modal__cta" onClick={handleAddToCart}>
							Add to Cart
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductModal;
