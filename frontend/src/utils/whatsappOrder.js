const STORE_NAME = 'WomenHub';

/**
 * Business WhatsApp number: country code + number, digits only.
 * Set in frontend/.env → VITE_WHATSAPP_NUMBER=919876543210
 */
export function getWhatsAppNumber() {
	const raw = import.meta.env.VITE_WHATSAPP_NUMBER;
	if (!raw || typeof raw !== 'string') return null;
	const digits = raw.replace(/\D/g, '');
	return digits.length >= 10 ? digits : null;
}

export function isWhatsAppConfigured() {
	return Boolean(getWhatsAppNumber());
}

/**
 * Build a readable order message for WhatsApp.
 */
export function formatWhatsAppOrderMessage(cartItems, total, customerNote = '') {
	const lines = [
		`Hello ${STORE_NAME}!`,
		'',
		'I would like to place an order:',
		'',
	];

	cartItems.forEach((item, index) => {
		const price = Number(item.price);
		const lineTotal = price * item.quantity;
		const category = item.category ? ` (${item.category})` : '';
		lines.push(`${index + 1}. *${item.name}*${category}`);
		lines.push(`   Qty: ${item.quantity} × ₹${price.toLocaleString('en-IN')} = ₹${lineTotal.toLocaleString('en-IN')}`);
		if (item.subcategory) {
			lines.push(`   Type: ${item.subcategory}`);
		}
		lines.push('');
	});

	lines.push('─────────────────');
	lines.push(`*Order total: ₹${Number(total).toLocaleString('en-IN')}*`);
	lines.push('');

	if (customerNote?.trim()) {
		lines.push('*Delivery / notes:*');
		lines.push(customerNote.trim());
		lines.push('');
	}

	lines.push('Please confirm availability, price, and delivery details.');
	lines.push('');
	lines.push('Thank you!');

	return lines.join('\n');
}

/**
 * Opens WhatsApp (app or web) with the order pre-filled.
 * @returns {{ ok: boolean, error?: string }}
 */
export function openWhatsAppOrder(cartItems, total, customerNote = '') {
	const phone = getWhatsAppNumber();
	if (!phone) {
		return {
			ok: false,
			error: 'WhatsApp is not set up yet. Add your number to frontend/.env (see .env.example).',
		};
	}

	if (!cartItems?.length) {
		return { ok: false, error: 'Your cart is empty.' };
	}

	const text = formatWhatsAppOrderMessage(cartItems, total, customerNote);
	const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

	window.open(url, '_blank', 'noopener,noreferrer');
	return { ok: true };
}
