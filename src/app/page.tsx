import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  Shield,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { FAQ } from "@/components/FAQ";
import { NewsletterForm } from "@/components/NewsletterForm";
import { OrderCounter } from "@/components/OrderCounter";
import {
  getAllProducts,
  getCategories,
  getFeaturedProducts,
  getPopularProducts,
  getRecommendedProducts,
} from "@/lib/products";
import { STORE, WHATSAPP_URL } from "@/lib/config";

export default function HomePage() {
  const featured = getFeaturedProducts(5);
  const popular = getPopularProducts(4);
  const recommended = getRecommendedProducts(undefined, 4);
  const categories = getCategories();
  const products = getAllProducts();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-600/20 via-transparent to-transparent" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div className="animate-fade-in-up">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">
              {STORE.tagline}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Votre boutique{" "}
              <span className="text-gold-400">premium</span> bien-être
            </h1>
            <p className="mt-6 max-w-lg text-lg text-stone-300">
              Produits sélectionnés, livraison partout au Togo. Commandez en
              toute confiance via WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/catalogue"
                className="rounded-full bg-gold-600 px-8 py-4 font-bold text-white shadow-lg transition hover:bg-gold-500"
              >
                Voir le catalogue
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-[#25D366] bg-[#25D366]/10 px-8 py-4 font-bold text-[#25D366] transition hover:bg-[#25D366] hover:text-white"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <Image
              src="/products/chocolat-detox-1.png"
              alt="Produits ZAYR SHOP"
              fill
              className="rounded-2xl object-cover shadow-2xl"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <div className="bg-gold-600 py-3 text-center text-sm font-semibold text-white">
        🎁 Livraison disponible partout au Togo — Commandez sur WhatsApp{" "}
        {STORE.whatsapp}
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="text-center font-serif text-3xl font-bold">
          Produits vedettes
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-stone-100 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-center font-serif text-3xl font-bold">
            Catégories
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const count = products.filter((p) => p.category === c.id).length;
              return (
                <Link
                  key={c.id}
                  href={`/catalogue?categorie=${c.id}`}
                  className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-gold-400 hover:shadow-md"
                >
                  <h3 className="font-serif text-xl font-semibold text-gold-700">
                    {c.label}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600">{c.description}</p>
                  <span className="mt-3 inline-block text-xs font-medium text-stone-500">
                    {count} produit{count > 1 ? "s" : ""}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {[
            {
              icon: Shield,
              title: "Qualité garantie",
              text: "Produits authentiques et sélectionnés",
            },
            {
              icon: Truck,
              title: "Livraison rapide",
              text: "Partout au Togo en 24-72h",
            },
            {
              icon: Leaf,
              title: "100% naturel",
              text: "Ingrédients soigneusement choisis",
            },
            {
              icon: Sparkles,
              title: "Service premium",
              text: "Support WhatsApp réactif",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-stone-100 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-center font-serif text-3xl font-bold">
            Produits populaires
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="text-center font-serif text-3xl font-bold">
          Recommandé pour vous
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl font-bold">Témoignages</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {[
                {
                  name: "Amina K.",
                  text: "Le thé fertilité est excellent. Livraison rapide à Lomé !",
                },
                {
                  name: "Koffi M.",
                  text: "Vitalité masculine : produit sérieux, je recommande ZAYR SHOP.",
                },
                {
                  name: "Sarah D.",
                  text: "Chocolat détox délicieux et efficace. Service WhatsApp au top.",
                },
              ].map((t) => (
                <blockquote
                  key={t.name}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex gap-1 text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 text-stone-600">&ldquo;{t.text}&rdquo;</p>
                  <cite className="mt-4 block text-sm font-semibold not-italic">
                    — {t.name}
                  </cite>
                </blockquote>
              ))}
            </div>
          </div>
          <OrderCounter />
        </div>
      </section>

      <section className="bg-stone-100 py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <h2 className="text-center font-serif text-3xl font-bold">FAQ</h2>
          <div className="mt-8">
            <FAQ />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-4 py-16 text-center md:px-6">
        <h2 className="font-serif text-2xl font-bold">Newsletter</h2>
        <p className="mt-2 text-stone-600">
          Recevez nos offres et nouveautés en avant-première.
        </p>
        <div className="mt-6">
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
