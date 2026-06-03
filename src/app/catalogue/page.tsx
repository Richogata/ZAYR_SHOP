import type { Metadata } from "next";
import { CatalogClient } from "@/components/CatalogClient";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Découvrez tous les produits ZAYR SHOP — bien-être, beauté et maison.",
};

export default function CataloguePage() {
  const products = getAllProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <h1 className="font-serif text-4xl font-bold">Catalogue</h1>
      <p className="mt-2 text-stone-600">
        {products.length} produits premium — filtrez et commandez en ligne.
      </p>
      <div className="mt-10">
        <CatalogClient products={products} />
      </div>
    </div>
  );
}
