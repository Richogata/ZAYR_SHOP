"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Product, ProductCategory } from "@/types/product";
import { getCategories } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function CatalogClient({ products }: { products: Product[] }) {
  const categories = getCategories();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc">(
    "default"
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = [...products];
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }
    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [query, category, sort, products]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            placeholder="Rechercher un produit..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-300 py-3 pl-10 pr-4 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200"
            aria-label="Rechercher"
          />
        </div>
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as ProductCategory | "all")
          }
          className="rounded-xl border border-stone-300 px-4 py-3"
          aria-label="Filtrer par catégorie"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value as "default" | "price-asc" | "price-desc")
          }
          className="rounded-xl border border-stone-300 px-4 py-3"
          aria-label="Trier"
        >
          <option value="default">Tri par défaut</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-stone-500">
          Aucun produit ne correspond à votre recherche.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
