import React, { useState } from 'react';

export default function DeptCard({ department, onClick }) {
	const [imgFailed, setImgFailed] = useState(false);

	return (
		<button
			type="button"
			className={`dept-card ${imgFailed ? 'dept-card--fallback' : ''}`}
			data-dept={department.key}
			onClick={onClick}
		>
			<div className="dept-card__media">
				{!imgFailed && (
					<img
						src={department.image}
						alt=""
						className="dept-card__img"
						loading="lazy"
						decoding="async"
						style={{
							objectPosition: department.imagePosition || 'center center',
						}}
						onError={() => setImgFailed(true)}
					/>
				)}
				<div className="dept-card__overlay" aria-hidden />
			</div>
			<div className="dept-card__text">
				<span className="dept-card__label">{department.label}</span>
				<h2 className="dept-card__title">{department.label}</h2>
				<p className="dept-card__desc">{department.description}</p>
				<span className="dept-card__cta">
					Explore
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
						<path
							d="M3 8h10M9 4l4 4-4 4"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			</div>
		</button>
	);
}
