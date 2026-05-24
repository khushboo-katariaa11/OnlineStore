import api from '../../lib/api';

const productsBase = '/products';

export async function getAllProducts(page = 1, limit = 10) {
	try {
		const response = await api.get(productsBase, { params: { page, limit } });
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
		throw new Error(error.response?.data?.message || 'Failed to fetch product');
	}
}

export async function addProduct(formData) {
	try {
		const response = await api.post(productsBase, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Failed to add product');
	}
}

export async function updateProduct(id, formData) {
	try {
		const response = await api.put(`${productsBase}/${id}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Failed to update product');
	}
}

export async function deleteProduct(id) {
	try {
		const response = await api.delete(`${productsBase}/${id}`);
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Failed to delete product');
	}
}

export async function getUniqueCategories() {
	try {
		const response = await api.get(`${productsBase}/unique/categories`);
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Failed to fetch categories');
	}
}

export async function getUniqueSubcategories(category = null) {
	try {
		const response = await api.get(`${productsBase}/unique/subcategories`, {
			params: category ? { category } : {},
		});
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Failed to fetch subcategories');
	}
}

export async function searchProducts(query, page = 1, limit = 10) {
	try {
		const response = await api.get(`${productsBase}/search`, {
			params: { q: query, page, limit },
		});
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Failed to search products');
	}
}

export async function getProductsByCategory(category, subcategory = null, page = 1, limit = 10) {
	try {
		const params = { page, limit };
		if (subcategory) params.subcategory = subcategory;
		const response = await api.get(`${productsBase}/category/${encodeURIComponent(category)}`, {
			params,
		});
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || 'Failed to fetch products by category');
	}
}

export function createProductFormData(productData, image = null) {
	const formData = new FormData();
	formData.append('category', productData.category);
	formData.append('subcategory', productData.subcategory || '');
	formData.append('name', productData.name);
	formData.append('price', productData.price);
	formData.append('description', productData.description);
	formData.append('colors', productData.colors);
	if (image) {
		formData.append('image', image);
	}
	return formData;
}
