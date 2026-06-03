import type { Metadata } from "next";
import { OrderForm } from "@/components/OrderForm";

export const metadata: Metadata = {
  title: "Commander",
  description: "Passez votre commande ZAYR SHOP — livraison et paiement à la réception.",
};

export default async function CommanderPage({
  searchParams,
}: {
  searchParams: Promise<{ produit?: string; qte?: string }>;
}) {
  const params = await searchParams;
  const qte = params.qte ? parseInt(params.qte, 10) : 1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <h1 className="font-serif text-4xl font-bold">Commander</h1>
      <p className="mt-2 text-stone-600">
        Remplissez le formulaire — vous serez redirigé vers WhatsApp avec votre
        commande pré-remplie.
      </p>
      <div className="mt-10">
        <OrderForm
          preselectedSlug={params.produit}
          preselectedQuantity={qte > 0 ? qte : 1}
        />
      </div>
    </div>
  );
}
