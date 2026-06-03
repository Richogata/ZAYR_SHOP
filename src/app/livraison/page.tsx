import type { Metadata } from "next";
import Link from "next/link";
import { Package, Clock, MapPin, ClipboardList } from "lucide-react";

export const metadata: Metadata = {
  title: "Livraison",
  description: "Informations de livraison ZAYR SHOP — délais, zones et procédure.",
};

export default function LivraisonPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="font-serif text-4xl font-bold">Livraison</h1>
      <p className="mt-4 text-lg text-stone-600">
        Nous livrons partout au Togo avec soin et professionnalisme.
      </p>

      <div className="mt-10 space-y-8">
        <section className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-6">
          <MapPin className="h-8 w-8 shrink-0 text-gold-600" />
          <div>
            <h2 className="font-semibold text-lg">Zone de livraison</h2>
            <p className="mt-2 text-stone-600">
              Livraison disponible partout au Togo : Lomé, Kara, Sokodé, Kpalimé
              et toutes les villes et villages accessibles par nos partenaires.
            </p>
          </div>
        </section>

        <section className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-6">
          <Clock className="h-8 w-8 shrink-0 text-gold-600" />
          <div>
            <h2 className="font-semibold text-lg">Délais de livraison</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-stone-600">
              <li>Lomé et environs : 24 à 48 heures</li>
              <li>Autres villes : 48 à 72 heures</li>
              <li>Zones éloignées : jusqu&apos;à 5 jours ouvrés</li>
            </ul>
          </div>
        </section>

        <section className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-6">
          <Package className="h-8 w-8 shrink-0 text-gold-600" />
          <div>
            <h2 className="font-semibold text-lg">Conditions</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-stone-600">
              <li>Paiement à la livraison (espèces ou Mobile Money)</li>
              <li>Frais de livraison communiqués à la confirmation</li>
              <li>Colis soigneusement emballé et discret</li>
              <li>Vérification du produit recommandée à la réception</li>
            </ul>
          </div>
        </section>

        <section className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-6">
          <ClipboardList className="h-8 w-8 shrink-0 text-gold-600" />
          <div>
            <h2 className="font-semibold text-lg">Procédure de commande</h2>
            <ol className="mt-2 list-inside list-decimal space-y-2 text-stone-600">
              <li>Choisissez votre produit sur le catalogue</li>
              <li>Remplissez le formulaire ou contactez-nous sur WhatsApp</li>
              <li>Nous confirmons disponibilité et frais de livraison</li>
              <li>Préparez le paiement pour la livraison</li>
              <li>Recevez votre colis et profitez !</li>
            </ol>
          </div>
        </section>
      </div>

      <Link
        href="/commander"
        className="mt-10 inline-block rounded-full bg-gold-600 px-8 py-4 font-bold text-white hover:bg-gold-700"
      >
        Passer commande
      </Link>
    </div>
  );
}
