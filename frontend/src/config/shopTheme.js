/** Store branding — laces, tailoring material & buttons */

export const SHOP = {
	name: 'WomenHub',
	tagline: 'Laces · Tailoring · Buttons',
	description:
		'Premium laces, tailoring fabrics, threads, and designer buttons for boutiques, tailors, and home sewists.',
};

/** Local images in /public/shop/ */
export const SHOP_IMAGES = {
	hero: '/shop/banner.png',
	login: '/shop/tailoring.png',
};

export const SHOP_DEPARTMENTS = [
	{
		key: 'lace',
		label: 'Laces',
		description: 'Embroidered, cotton & designer lace by the metre',
		image: '/shop/laces.png',
		imagePosition: 'center top',
		match: (name) => /lace/i.test(name),
	},
	{
		key: 'tailoring',
		label: 'Tailoring Material',
		description: 'Fabrics, linings, threads & tailoring essentials',
		image: '/shop/tailoring.png',
		imagePosition: 'center center',
		match: (name) => /tailor|fabric|material|thread|lining|cloth/i.test(name),
	},
	{
		key: 'buttons',
		label: 'Buttons',
		description: 'Pearl, metal, shell & novelty button collections',
		image: '/shop/buttons.png',
		imagePosition: 'center center',
		match: (name) => /button/i.test(name),
	},
];

/** Pick first API category that matches a department keyword */
export function matchCategoryForDepartment(categories, department) {
	if (!categories?.length) return null;
	return categories.find((cat) => department.match(cat)) ?? null;
}
