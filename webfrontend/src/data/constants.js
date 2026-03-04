// Images from https://ammayi.dm2buy.com
// If an image fails to load, the app falls back to placeholder. Update paths below to match your site’s structure.
const AMMAYI_BASE = "https://ammayi.dm2buy.com";

// Hero banner (home page)
export const HERO_IMAGE = `${AMMAYI_BASE}/uploads/hero-banner.jpg`;

// Category cards on home
export const CATEGORY_IMAGES = {
  Party: `${AMMAYI_BASE}/uploads/categories/party.jpg`,
  Casual: `${AMMAYI_BASE}/uploads/categories/casual.jpg`,
  Wedding: `${AMMAYI_BASE}/uploads/categories/wedding.jpg`,
  Summer: `${AMMAYI_BASE}/uploads/categories/summer.jpg`,
};

// Product images: AMMAYI_BASE + /uploads/products/1.jpg, 2.jpg, ...
export const PRODUCT_IMAGE_BASE = `${AMMAYI_BASE}/uploads/products`;

export function getProductImageUrl(productId, index = 0) {
  if (index === 0) return `${PRODUCT_IMAGE_BASE}/${productId}.jpg`;
  return `${PRODUCT_IMAGE_BASE}/${productId}-${index}.jpg`;
}
