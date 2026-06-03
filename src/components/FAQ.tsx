"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const items = [
  {
    q: "Comment passer commande ?",
    a: "Choisissez votre produit, remplissez le formulaire de commande ou contactez-nous sur WhatsApp. Nous confirmons votre commande rapidement.",
  },
  {
    q: "Quels sont les délais de livraison ?",
    a: "Livraison en 24 à 72 h selon votre ville au Togo. Livraison disponible partout au pays.",
  },
  {
    q: "Quels modes de paiement acceptez-vous ?",
    a: "Paiement à la livraison (espèces ou Mobile Money selon disponibilité). Merci de commander uniquement si vous êtes prêt à payer.",
  },
  {
    q: "Les produits sont-ils authentiques ?",
    a: "Oui, ZAYR SHOP sélectionne uniquement des produits premium de marques reconnues (Wins Town, ISOLFAN, etc.).",
  },
  {
    q: "Puis-je annuler ma commande ?",
    a: "Contactez-nous sur WhatsApp au plus vite. Les commandes déjà expédiées ne peuvent pas être annulées.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={item.q}
          className="overflow-hidden rounded-xl border border-stone-200 bg-white"
        >
          <button
            type="button"
            className="flex w-full items-center justify-between px-5 py-4 text-left font-medium"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            {item.q}
            <ChevronDown
              className={`h-5 w-5 transition ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <p className="border-t border-stone-100 px-5 py-4 text-sm text-stone-600">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
