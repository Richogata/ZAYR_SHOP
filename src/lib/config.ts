export const STORE = {
  name: "ZAYR SHOP",
  tagline: "Beauté • Maison • Bien-être",
  description:
    "Boutique premium de bien-être, beauté et maison. Produits sélectionnés, livraison partout au Togo.",
  whatsapp: "+22890799757",
  whatsappDigits: "22890799757",
  email: "contact@zayrshop.tg",
  instagram: "https://instagram.com/zayrshop",
  facebook: "https://facebook.com/zayrshop",
} as const;

export const WHATSAPP_URL = `https://wa.me/${STORE.whatsappDigits}`;

export const ORDER_STATUSES = {
  PENDING: { label: "En attente", color: "bg-amber-100 text-amber-800" },
  CONFIRMED: { label: "Confirmée", color: "bg-blue-100 text-blue-800" },
  SHIPPED: { label: "Expédiée", color: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "Livrée", color: "bg-green-100 text-green-800" },
  CANCELED: { label: "Annulée", color: "bg-red-100 text-red-800" },
} as const;

export const ANTI_FAKE_ORDER_MESSAGE =
  "⚠️ Merci de passer commande uniquement si vous êtes réellement prêt à recevoir et payer votre commande. Chaque livraison mobilise du temps, du personnel et des ressources. Merci de respecter le travail de nos livreurs.";
