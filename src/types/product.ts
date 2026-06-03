export type ProductCategory =
  | "beaute-bien-etre"
  | "sante-feminine"
  | "minceur"
  | "sante-masculine"
  | "fitness-sport";

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  currency: string;
  category: ProductCategory;
  brand?: string;
  images: string[];
  benefits: string[];
  featured?: boolean;
  popular?: boolean;
  recommended?: boolean;
  inStock: boolean;
}

export interface ProductsData {
  products: Product[];
  categories: { id: ProductCategory; label: string; description: string }[];
}
