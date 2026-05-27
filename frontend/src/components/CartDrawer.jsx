import React, { useEffect, useState } from 'react';
import { useCart } from '../features/cart/cart.context';
import { getFullImageUrl, PLACEHOLDER_IMAGE } from '../utils/imageUrl';
import { openWhatsAppOrder, isWhatsAppConfigured } from '../utils/whatsappOrder';
import { CloseIcon, WhatsAppIcon } from './icons';
import './cart-drawer.css';

export default function CartDrawer({ open, onClose }) {
	const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
	const [orderNote, setOrderNote] = useState('');
	const [whatsappError, setWhatsappError] = useState('');

	useEffect(() => {
		const onKey = (e) => {
			if (e.key === 'Escape' && open) onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open, onClose]);

	useEffect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			if (!open) document.body.style.overflow = '';
		};
	}, [open]);

	useEffect(() => {
		if (!open) {
			setWhatsappError('');
		}
	}, [open]);

	const handleWhatsAppOrder = () => {
		setWhatsappError('');
		const result = openWhatsAppOrder(cartItems, getCartTotal(), orderNote);

		if (!result.ok) {
			setWhatsappError(result.error);
		}
	};

	return (
		<>
			<div
				className={`cart-drawer__backdrop ${open ? 'cart-drawer__backdrop--open' : ''}`}
				onClick={onClose}
				aria-hidden={!open}
			/>
			<aside
				className={`cart-drawer ${open ? 'cart-drawer--open' : ''}`}
				role="dialog"
				aria-modal="true"
				aria-label="Shopping cart"
				aria-hidden={!open}
			>
				<div className="cart-drawer__header">
					<h2 className="cart-drawer__title">Your Cart</h2>
					<button type="button" className="cart-drawer__close" onClick={onClose} aria-label="Close cart">
						<CloseIcon />
					</button>
				</div>

				<div className="cart-drawer__body">
					{cartItems.length === 0 ? (
						<div className="cart-drawer__empty">
							<p>Your cart is empty</p>
							<button type="button" className="btn btn--primary" onClick={onClose}>
								Continue Shopping
							</button>
						</div>
					) : (
						cartItems.map((item) => (
							<article key={item._id} className="cart-item">
								<img
									src={getFullImageUrl(item.image)}
									alt="Product"
									className="cart-item__image"
									loading="lazy"
									onError={(e) => {
										e.target.src = PLACEHOLDER_IMAGE;
									}}
								/>
								<div>
									<p className="cart-item__price">₹{Number(item.price).toLocaleString('en-IN')}</p>
									<div className="cart-item__qty">
										<button
											type="button"
											onClick={() => updateQuantity(item._id, item.quantity - 1)}
											aria-label="Decrease quantity"
										>
											−
										</button>
										<span>{item.quantity}</span>
										<button
											type="button"
											onClick={() => updateQuantity(item._id, item.quantity + 1)}
											aria-label="Increase quantity"
										>
											+
										</button>
									</div>
								</div>
								<button
									type="button"
									className="cart-item__remove"
									onClick={() => removeFromCart(item._id)}
								>
									Remove
								</button>
							</article>
						))
					)}
				</div>

				{cartItems.length > 0 && (
					<div className="cart-drawer__footer">
						<div className="cart-drawer__total">
							<span>Subtotal</span>
							<strong>₹{getCartTotal().toLocaleString('en-IN')}</strong>
						</div>

						<label className="cart-drawer__note">
							<span className="cart-drawer__note-label">Delivery note (optional)</span>
							<textarea
								value={orderNote}
								onChange={(e) => setOrderNote(e.target.value)}
								placeholder="Address, size, or special instructions…"
								rows={2}
								maxLength={500}
							/>
						</label>

						{whatsappError && (
							<p className="cart-drawer__whatsapp-error" role="alert">
								{whatsappError}
							</p>
						)}

						<div className="cart-drawer__actions">
							<button
								type="button"
								className="btn btn--whatsapp"
								onClick={handleWhatsAppOrder}
								title={
									isWhatsAppConfigured()
										? 'Send order on WhatsApp'
										: 'Set VITE_WHATSAPP_NUMBER in frontend/.env'
								}
							>
								<WhatsAppIcon />
								Place order on WhatsApp
							</button>
							<button type="button" className="btn btn--primary" onClick={onClose}>
								Continue Shopping
							</button>
							<button type="button" className="btn btn--secondary" onClick={clearCart}>
								Clear Cart
							</button>
						</div>
					</div>
				)}
			</aside>
		</>
	);
}

export function Toast({ message, visible }) {
	return (
		<div className={`toast ${visible ? 'toast--visible' : ''}`} role="status" aria-live="polite">
			{message}
		</div>
	);
}
