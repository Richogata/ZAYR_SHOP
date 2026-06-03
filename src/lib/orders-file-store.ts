import { promises as fs } from "fs";
import path from "path";
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

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function ensureFile(): Promise<StoredOrder[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(raw) as StoredOrder[];
  } catch {
    return [];
  }
}

async function writeOrders(orders: StoredOrder[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export async function fileCreateOrder(
  data: Omit<StoredOrder, "id" | "createdAt">
): Promise<StoredOrder> {
  const orders = await ensureFile();
  const order: StoredOrder = {
    ...data,
    id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  await writeOrders(orders);
  return order;
}

export async function fileListOrders(): Promise<StoredOrder[]> {
  return ensureFile();
}

export async function fileUpdateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<StoredOrder | null> {
  const orders = await ensureFile();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], status };
  await writeOrders(orders);
  return orders[idx];
}

export async function fileCountOrders(): Promise<number> {
  const orders = await ensureFile();
  return orders.length;
}
