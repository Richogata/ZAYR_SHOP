import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/produits/${product.slug}`} className="relative aspect-square overflow-hidden bg-stone-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <span className="text-xs font-medium uppercase tracking-wider text-gold-600">
            {product.brand}
          </span>
        )}
        <h3 className="mt-1 font-serif text-lg font-semibold text-stone-900">
          <Link href={`/produits/${product.slug}`} className="hover:text-gold-700">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-stone-600">
          {product.shortDescription}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-gold-700">
            {formatPrice(product.price, product.currency)}
          </span>
          <Link
            href={`/produits/${product.slug}`}
            className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gold-700"
          >
            Voir le produit
          </Link>
        </div>
      </div>
    </article>
  );
}
