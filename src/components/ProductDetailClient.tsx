"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice, getRelatedProducts } from "@/lib/products";
import { getWhatsAppGeneralUrl } from "@/lib/whatsapp";
import { STORE } from "@/lib/config";
import { AntiFakeOrderAlert } from "./AntiFakeOrderAlert";
import { ProductCard } from "./ProductCard";

export function ProductDetailClient({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const related = getRelatedProducts(product.category, product.slug);
  const total = product.price * quantity;

  const whatsappText = `Bonjour ${STORE.name}, je souhaite commander : ${product.name} (x${quantity}) — ${formatPrice(total)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? "border-gold-600" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          {product.brand && (
            <span className="text-sm font-semibold uppercase tracking-wider text-gold-600">
              {product.brand}
            </span>
          )}
          <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900 md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-bold text-gold-700">
            {formatPrice(product.price, product.currency)}
          </p>
          <p className="mt-6 leading-relaxed text-stone-600">{product.description}</p>
          <ul className="mt-6 space-y-2">
            {product.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-stone-700">
                <Check className="h-5 w-5 text-green-600" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-4">
            <label className="text-sm font-medium">Quantité</label>
            <input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              className="w-20 rounded-lg border border-stone-300 px-3 py-2 text-center"
            />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/commander?produit=${product.slug}&qte=${quantity}`}
              className="flex-1 rounded-full bg-gold-600 py-4 text-center font-bold text-white transition hover:bg-gold-700"
            >
              Commander
            </Link>
            <a
              href={getWhatsAppGeneralUrl(whatsappText)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 font-bold text-white transition hover:bg-[#1da851]"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
          <div className="mt-6">
            <AntiFakeOrderAlert />
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-bold">Produits similaires</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
