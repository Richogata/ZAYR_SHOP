import type { OrderStatus } from "@prisma/client";

export interface StoredOrder {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  whatsapp?: string | null;
  address: string;
  city: string;
  productName: string;
  productSlug?: string | null;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  comment?: string | null;
  status: OrderStatus;
}

// Stockage en mémoire (persist tant que le serveur tourne)
// Compatible avec l'environnement Vercel (filesystem read-only)
const ordersStore: StoredOrder[] = [];

export async function fileCreateOrder(
  data: Omit<StoredOrder, "id" | "createdAt">
): Promise<StoredOrder> {
  const order: StoredOrder = {
    ...data,
    id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  ordersStore.unshift(order);
  return order;
}

export async function fileListOrders(): Promise<StoredOrder[]> {
  return ordersStore;
}

export async function fileUpdateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<StoredOrder | null> {
  const idx = ordersStore.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  ordersStore[idx] = { ...ordersStore[idx], status };
  return ordersStore[idx];
}

export async function fileCountOrders(): Promise<number> {
  return ordersStore.length;
}
