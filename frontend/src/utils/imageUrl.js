import { getApiBaseUrl } from '../lib/api';

const API_BASE_URL = getApiBaseUrl();

export function getFullImageUrl(imagePath) {
	if (!imagePath) return null;
	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath;
	}
	if (imagePath.startsWith('/')) {
		return API_BASE_URL + imagePath;
	}
	return `${API_BASE_URL}/uploads/${imagePath}`;
}

export const PLACEHOLDER_IMAGE =
	'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%23f3f0ec" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="14" fill="%239ca3af"%3ENo image%3C/text%3E%3C/svg%3E';
