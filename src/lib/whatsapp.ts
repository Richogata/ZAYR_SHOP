import { STORE } from "./config";

export interface OrderWhatsAppPayload {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  comment?: string;
}

export function buildOrderWhatsAppMessage(
  payload: OrderWhatsAppPayload
): string {
  const lines = [
    `Nom : ${payload.customerName}`,
    `Téléphone : ${payload.phone}`,
    `Adresse : ${payload.address}`,
    `Produit : ${payload.productName}`,
    `Quantité : ${payload.quantity}`,
    `Montant : ${payload.totalAmount.toLocaleString("fr-FR")} FCFA`,
  ];
  if (payload.comment?.trim()) {
    lines.push(`Commentaire : ${payload.comment.trim()}`);
  }
  return lines.join("\n");
}

export function getWhatsAppOrderUrl(message: string): string {
  return `https://wa.me/${STORE.whatsappDigits}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppGeneralUrl(text?: string): string {
  if (!text) return `https://wa.me/${STORE.whatsappDigits}`;
  return `https://wa.me/${STORE.whatsappDigits}?text=${encodeURIComponent(text)}`;
}
