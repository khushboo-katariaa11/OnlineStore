import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Layout from '../../../components/Layout';
import { useAuth } from '../auth.context';
import { useHandleLogin } from '../hooks/useAuth';
import { SHOP, SHOP_IMAGES, SHOP_DEPARTMENTS } from '../../../config/shopTheme';
import './login.css';

export default function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { loading } = useAuth();
	const handleLogin = useHandleLogin();

	const onSubmit = async (e) => {
		e.preventDefault();
		setError('');
		const result = await handleLogin(email, password);
		if (!result.success) {
			setError(result.error);
		} else {
			navigate('/dashboard');
		}
	};

	return (
		<Layout showCart={false} variant="minimal">
			<div className="login-page">
				<div className="login-mobile-banner" aria-hidden>
					<img src={SHOP_IMAGES.login} alt="" loading="eager" decoding="async" />
					<div className="login-mobile-banner__overlay" />
					<div className="login-mobile-banner__text">
						<span>{SHOP.tagline}</span>
						<strong>{SHOP.name}</strong>
					</div>
				</div>

				<div className="login-split">
					<div className="login-brand">
						<img
							className="login-brand__bg"
							src={SHOP_IMAGES.login}
							alt=""
							aria-hidden
							loading="eager"
							decoding="async"
						/>
						<div className="login-brand__overlay" aria-hidden />
						<div className="login-brand__content">
							<p className="login-brand__eyebrow">{SHOP.tagline}</p>
							<h1>{SHOP.name}</h1>
							<p>{SHOP.description}</p>
							<ul className="login-brand__highlights">
								{SHOP_DEPARTMENTS.map((d) => (
									<li key={d.key}>
										<img src={d.image} alt="" loading="lazy" decoding="async" />
										<span>{d.label}</span>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="login-form-wrap">
						<div className="login-card">
							<h2 className="login-card__title">Admin sign in</h2>
							<p className="login-card__subtitle">
								Manage laces, tailoring stock & buttons
							</p>

							<form onSubmit={onSubmit}>
								<div className="login-field">
									<label htmlFor="email">Email</label>
									<input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										autoComplete="email"
										required
										disabled={loading}
									/>
								</div>
								<div className="login-field">
									<label htmlFor="password">Password</label>
									<input
										id="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										autoComplete="current-password"
										required
										disabled={loading}
									/>
								</div>
								{error && (
									<div className="login-error" role="alert">
										{error}
									</div>
								)}
								<button type="submit" className="login-submit" disabled={loading}>
									{loading ? 'Signing in…' : 'Sign in'}
								</button>
							</form>

							<Link to="/" className="login-back">
								← Back to shop
							</Link>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
