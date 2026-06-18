export const REMOVED_PRODUCTS_KEY = 'bookmarket_removed_products';

export function getRemovedProductIds(): string[] {
  try {
    const stored = localStorage.getItem(REMOVED_PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function isProductRemoved(productId: string): boolean {
  return getRemovedProductIds().includes(productId);
}

export function saveRemovedProductIds(ids: string[]) {
  localStorage.setItem(REMOVED_PRODUCTS_KEY, JSON.stringify(Array.from(new Set(ids))));
}
