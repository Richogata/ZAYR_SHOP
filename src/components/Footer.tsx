import Link from "next/link";
import { Globe, Mail, Phone, Share2 } from "lucide-react";
import { Logo } from "./Logo";
import { STORE, WHATSAPP_URL } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gold-200/50 bg-stone-950 text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <div className="[&_span]:text-gold-400 [&_.text-stone-600]:text-stone-400">
            <Logo compact />
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-400">
            {STORE.description}
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href={STORE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-stone-800 p-2 transition hover:bg-gold-600"
              aria-label="Instagram"
            >
              <Share2 className="h-5 w-5" />
            </a>
            <a
              href={STORE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-stone-800 p-2 transition hover:bg-gold-600"
              aria-label="Facebook"
            >
              <Globe className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${STORE.email}`}
              className="rounded-full bg-stone-800 p-2 transition hover:bg-gold-600"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-gold-400">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/catalogue" className="hover:text-gold-400">
                Catalogue
              </Link>
            </li>
            <li>
              <Link href="/livraison" className="hover:text-gold-400">
                Livraison
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold-400">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/commander" className="hover:text-gold-400">
                Commander
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-gold-400">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold-400"
              >
                <Phone className="h-4 w-4 text-green-400" />
                {STORE.whatsapp}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${STORE.email}`}
                className="flex items-center gap-2 hover:text-gold-400"
              >
                <Mail className="h-4 w-4" />
                {STORE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {STORE.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
