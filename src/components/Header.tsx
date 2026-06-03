"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/livraison", label: "Livraison" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold-200/40 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-stone-700 transition hover:text-gold-700"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/catalogue"
            className="hidden rounded-full p-2 text-stone-600 transition hover:bg-gold-50 hover:text-gold-700 sm:inline-flex"
            aria-label="Rechercher des produits"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/commander"
            className="hidden items-center gap-2 rounded-full bg-gold-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-gold-700 sm:inline-flex"
          >
            <ShoppingBag className="h-4 w-4" />
            Commander
          </Link>
          <button
            type="button"
            className="rounded-full p-2 text-stone-700 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-stone-100 bg-white px-4 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-3 text-stone-700"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/commander"
            className="mt-2 block rounded-full bg-gold-600 px-4 py-3 text-center font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            Commander
          </Link>
        </nav>
      )}
    </header>
  );
}
