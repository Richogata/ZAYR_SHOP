import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zayr-shop.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts();
  const staticPages = ["", "/catalogue", "/livraison", "/contact", "/commander"].map(
    (path) => ({
      url: `${BASE}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );
  const productPages = products.map((p) => ({
    url: `${BASE}/produits/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));
  return [...staticPages, ...productPages];
}
