import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../features/auth/auth.context';
import { SHOP } from '../config/shopTheme';
import { CartIcon, MenuIcon, CloseIcon } from './icons';
import './layout.css';

export default function Layout({
	children,
	onCartClick,
	cartCount = 0,
	showCart = true,
	variant = 'store',
}) {
	const { token } = useAuth();
	const location = useLocation();
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		setMenuOpen(false);
	}, [location.pathname]);

	useEffect(() => {
		document.body.style.overflow = menuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [menuOpen]);

	const isActive = (path) => location.pathname === path;

	return (
		<div className="site-layout">
			<header className="site-header">
				<div className="site-header__inner">
					<Link to="/" className="site-logo">
						<span className="site-logo__name">{SHOP.name}</span>
						<span className="site-logo__tagline">{SHOP.tagline}</span>
					</Link>

					<nav className="site-nav" aria-label="Main">
						<Link to="/" className={`site-nav__link ${isActive('/') ? 'site-nav__link--active' : ''}`}>
							Shop
						</Link>
						{token ? (
							<Link
								to="/dashboard"
								className={`site-nav__link ${isActive('/dashboard') ? 'site-nav__link--active' : ''}`}
							>
								Dashboard
							</Link>
						) : (
							<Link
								to="/login"
								className={`site-nav__link ${isActive('/login') ? 'site-nav__link--active' : ''}`}
							>
								Admin
							</Link>
						)}
					</nav>

					<div className="site-header__actions">
						{showCart && variant !== 'minimal' && (
							<button
								type="button"
								className="icon-btn cart-btn"
								onClick={onCartClick}
								aria-label={`Shopping cart, ${cartCount} items`}
							>
								<CartIcon />
								{cartCount > 0 && (
									<span className="cart-btn__badge" aria-hidden>
										{cartCount > 99 ? '99+' : cartCount}
									</span>
								)}
							</button>
						)}
						<button
							type="button"
							className="icon-btn icon-btn--menu"
							onClick={() => setMenuOpen((o) => !o)}
							aria-expanded={menuOpen}
							aria-label={menuOpen ? 'Close menu' : 'Open menu'}
						>
							{menuOpen ? <CloseIcon /> : <MenuIcon />}
						</button>
					</div>
				</div>
			</header>

			<div
				className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`}
				onClick={() => setMenuOpen(false)}
				role="presentation"
			>
				<nav
					className="mobile-nav__panel"
					aria-label="Mobile"
					onClick={(e) => e.stopPropagation()}
				>
					<Link
						to="/"
						className={`mobile-nav__link ${isActive('/') ? 'mobile-nav__link--active' : ''}`}
					>
						Shop
					</Link>
					{token ? (
						<Link
							to="/dashboard"
							className={`mobile-nav__link ${isActive('/dashboard') ? 'mobile-nav__link--active' : ''}`}
						>
							Dashboard
						</Link>
					) : (
						<Link
							to="/login"
							className={`mobile-nav__link ${isActive('/login') ? 'mobile-nav__link--active' : ''}`}
						>
							Admin Login
						</Link>
					)}
				</nav>
			</div>

			<main className="site-main">{children}</main>

			{variant !== 'minimal' && (
				<footer className="site-footer">
					<div className="site-footer__inner">
						<span className="site-footer__brand">{SHOP.name}</span>
						<p className="site-footer__copy">
							&copy; {new Date().getFullYear()} {SHOP.name}. {SHOP.tagline} — wholesale & retail.
						</p>
					</div>
				</footer>
			)}
		</div>
	);
}
