import api from '../../lib/api';

const productsBase = '/products';

export async function getAllProducts(page = 1, limit = 48) {
	try {
		const response = await api.get(productsBase, { params: { page, limit } });
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Failed to fetch products');
	}
}

export async function getCategories() {
	try {
		const response = await api.get(`${productsBase}/unique/categories`);
		return response.data.categories || [];
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Failed to fetch categories');
	}
}

export async function getSubcategories(category) {
	try {
		const response = await api.get(`${productsBase}/unique/subcategories`, {
			params: { category },
		});
		return response.data.subcategories || [];
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Failed to fetch subcategories');
	}
}

export async function getProductsByCategory(category, subcategory = '', page = 1, limit = 20) {
	try {
		const response = await api.get(`${productsBase}/category/${encodeURIComponent(category)}`, {
			params: { subcategory, page, limit },
		});
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Failed to fetch products');
	}
}

export async function getProductById(id) {
	try {
		const response = await api.get(`${productsBase}/${id}`);
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Product not found');
	}
}

export async function searchProducts(query, page = 1, limit = 20) {
	try {
		const response = await api.get(`${productsBase}/search`, {
			params: { q: query, page, limit },
		});
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Search failed');
	}
}
