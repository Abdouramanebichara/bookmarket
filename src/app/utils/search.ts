import { Category, Librairie, Product } from '../types';

export interface SearchProductResult {
  kind: 'product';
  item: Product;
  score: number;
  reasons: string[];
}

export interface SearchLibraryResult {
  kind: 'library';
  item: Librairie;
  score: number;
  reasons: string[];
}

export type SearchResult = SearchProductResult | SearchLibraryResult;

const STOP_WORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'd', 'l', 'et', 'ou', 'a', 'à', 'au', 'aux',
  'en', 'pour', 'avec', 'sur', 'dans', 'the', 'a', 'an', 'and', 'or', 'of', 'for', 'with', 'in',
]);

export function normalizeSearchText(value: unknown): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function tokenizeSearchQuery(query: string): string[] {
  return normalizeSearchText(query)
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function getCategoryLabel(category?: Category): string {
  if (!category) return '';
  return typeof category.name === 'string' ? category.name : `${category.name.fr} ${category.name.en}`;
}

function fieldScore(field: string, tokens: string[], weight: number, reasons: string[], label: string): number {
  const normalizedField = normalizeSearchText(field);
  if (!normalizedField) return 0;

  let score = 0;
  for (const token of tokens) {
    if (normalizedField === token) {
      score += weight * 5;
      reasons.push(label);
    } else if (normalizedField.startsWith(token)) {
      score += weight * 3;
      reasons.push(label);
    } else if (normalizedField.includes(token)) {
      score += weight * 2;
      reasons.push(label);
    } else {
      const words = normalizedField.split(/\s+/);
      if (words.some((word) => word.startsWith(token) || token.startsWith(word))) {
        score += weight;
        reasons.push(label);
      }
    }
  }
  return score;
}

export function searchProductsAndLibraries(params: {
  query: string;
  products: Product[];
  libraries: Librairie[];
  categories: Category[];
}): SearchResult[] {
  const { query, products, libraries, categories } = params;
  const tokens = tokenizeSearchQuery(query);

  if (tokens.length === 0) {
    return products
      .filter((product) => product.featured || product.rating >= 4.6)
      .slice(0, 12)
      .map((product) => ({ kind: 'product' as const, item: product, score: product.rating * 10, reasons: ['recommandé'] }));
  }

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const libraryById = new Map(libraries.map((library) => [library.id, library]));

  const productResults: SearchProductResult[] = products.map((product) => {
    const category = categoryById.get(product.categoryId);
    const library = libraryById.get(product.librarieId);
    const reasons: string[] = [];

    let score = 0;
    score += fieldScore(product.title, tokens, 12, reasons, 'titre');
    score += fieldScore(product.author, tokens, 8, reasons, 'auteur');
    score += fieldScore(product.publisher, tokens, 5, reasons, 'éditeur');
    score += fieldScore(product.isbn, tokens, 8, reasons, 'ISBN');
    score += fieldScore(product.description, tokens, 3, reasons, 'description');
    score += fieldScore(getCategoryLabel(category), tokens, 7, reasons, 'catégorie');
    score += fieldScore(category?.slug, tokens, 5, reasons, 'catégorie');
    score += fieldScore(library?.name, tokens, 6, reasons, 'librairie');
    score += fieldScore(library?.city, tokens, 2, reasons, 'ville');

    if (product.featured) score += 2;
    score += Math.min(product.rating || 0, 5);
    if ((product.stock ?? 0) > 0) score += 1;

    return { kind: 'product' as const, item: product, score, reasons: Array.from(new Set(reasons)) };
  });

  const libraryResults: SearchLibraryResult[] = libraries.map((library) => {
    const reasons: string[] = [];
    let score = 0;

    score += fieldScore(library.name, tokens, 11, reasons, 'nom');
    score += fieldScore(library.description, tokens, 3, reasons, 'description');
    score += fieldScore(library.address, tokens, 6, reasons, 'adresse');
    score += fieldScore(library.city, tokens, 5, reasons, 'ville');
    score += fieldScore(library.phone, tokens, 4, reasons, 'téléphone');

    if (library.verified) score += 2;
    score += Math.min(library.rating || 0, 5);

    return { kind: 'library' as const, item: library, score, reasons: Array.from(new Set(reasons)) };
  });

  return [...productResults, ...libraryResults]
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 60);
}
