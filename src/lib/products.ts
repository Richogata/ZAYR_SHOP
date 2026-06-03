import productsData from "../../data/products.json";
import type { Product, ProductCategory, ProductsData } from "@/types/product";

const data = productsData as ProductsData;

export function getAllProducts(): Product[] {
  return data.products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return data.products.find((p) => p.slug === slug);
}

export function getCategories() {
  return data.categories;
}

export function getCategoryLabel(id: ProductCategory): string {
  return data.categories.find((c) => c.id === id)?.label ?? id;
}

export function getFeaturedProducts(limit = 4): Product[] {
  return data.products.filter((p) => p.featured).slice(0, limit);
}

export function getPopularProducts(limit = 4): Product[] {
  return data.products.filter((p) => p.popular).slice(0, limit);
}

export function getRecommendedProducts(
  excludeSlug?: string,
  limit = 4
): Product[] {
  return data.products
    .filter((p) => p.recommended && p.slug !== excludeSlug)
    .slice(0, limit);
}

export function getRelatedProducts(
  category: ProductCategory,
  excludeSlug: string,
  limit = 3
): Product[] {
  return data.products
    .filter((p) => p.category === category && p.slug !== excludeSlug)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return data.products;
  return data.products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q)
  );
}

export function filterProducts(options: {
  category?: ProductCategory | "all";
  minPrice?: number;
  maxPrice?: number;
  query?: string;
}): Product[] {
  let list = options.query ? searchProducts(options.query) : [...data.products];
  if (options.category && options.category !== "all") {
    list = list.filter((p) => p.category === options.category);
  }
  if (options.minPrice != null) {
    list = list.filter((p) => p.price >= options.minPrice!);
  }
  if (options.maxPrice != null) {
    list = list.filter((p) => p.price <= options.maxPrice!);
  }
  return list;
}

export function formatPrice(price: number, currency = "FCFA"): string {
  return `${price.toLocaleString("fr-FR")} ${currency}`;
}
