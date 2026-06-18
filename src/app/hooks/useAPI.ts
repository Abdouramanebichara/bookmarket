import { useState, useCallback } from 'react';
import { CATEGORIES, MOCK_LIBRAIRIES, MOCK_PRODUCTS, MOCK_REVIEWS } from '../data/mockData';

const USE_REMOTE_API = import.meta.env.VITE_USE_REMOTE_API === 'true';
const API_URL = import.meta.env.VITE_API_URL || '';

function normalizeEndpoint(endpoint: string) {
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

function getMockResponse(endpoint: string) {
  const normalized = normalizeEndpoint(endpoint);
  const [pathname, queryString = ''] = normalized.split('?');
  const params = new URLSearchParams(queryString);

  if (pathname === '/categories') {
    return { categories: CATEGORIES };
  }

  if (pathname === '/librairies') {
    return { librairies: MOCK_LIBRAIRIES };
  }

  if (pathname.startsWith('/librairies/')) {
    const id = pathname.split('/').pop();
    return { librairie: MOCK_LIBRAIRIES.find((library) => library.id === id) || null };
  }

  if (pathname === '/products') {
    let products = [...MOCK_PRODUCTS];
    const search = (params.get('search') || params.get('q') || '').toLowerCase().trim();
    const categoryId = params.get('categoryId') || params.get('category');
    const sortBy = params.get('sortBy') || params.get('sort');
    const limit = Number(params.get('limit') || 0);

    if (search) {
      products = products.filter((product) =>
        [product.title, product.author, product.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search))
      );
    }

    if (categoryId) {
      products = products.filter((product) => product.categoryId === categoryId);
    }

    if (sortBy === 'rating') products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'newest') products.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    if (sortBy === 'price-asc') products.sort((a, b) => (a.salePrice || 0) - (b.salePrice || 0));
    if (sortBy === 'price-desc') products.sort((a, b) => (b.salePrice || 0) - (a.salePrice || 0));

    return { products: limit ? products.slice(0, limit) : products };
  }

  if (pathname.startsWith('/products/')) {
    const id = pathname.split('/').pop();
    return { product: MOCK_PRODUCTS.find((product) => product.id === id) || null };
  }

  if (pathname === '/reviews') {
    const targetId = params.get('targetId');
    const targetType = params.get('targetType');
    return {
      reviews: MOCK_REVIEWS.filter((review) =>
        (!targetId || review.targetId === targetId) && (!targetType || review.targetType === targetType)
      ),
    };
  }

  if (pathname.startsWith('/favorites')) {
    return { success: true };
  }

  return { success: true };
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) localStorage.setItem('auth_token', token);
  else localStorage.removeItem('auth_token');
}

export function getAuthToken(): string {
  if (!authToken) authToken = localStorage.getItem('auth_token');
  return authToken || 'local-token';
}

export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);

    try {
      if (!USE_REMOTE_API || !API_URL) {
        await new Promise((resolve) => setTimeout(resolve, 120));
        const data = getMockResponse(endpoint);
        setLoading(false);
        return data;
      }

      const response = await fetch(`${API_URL}${normalizeEndpoint(endpoint)}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
          ...options.headers,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed');
      setLoading(false);
      return data;
    } catch (err: any) {
      console.error('API error:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const get = useCallback((endpoint: string) => request(endpoint, { method: 'GET' }), [request]);
  const post = useCallback((endpoint: string, data: any) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }), [request]);
  const put = useCallback((endpoint: string, data: any) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }), [request]);
  const del = useCallback((endpoint: string) => request(endpoint, { method: 'DELETE' }), [request]);

  return { loading, error, get, post, put, del };
}
