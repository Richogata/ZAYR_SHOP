import type { OrderStatus } from "@prisma/client";
import { isDatabaseConfigured, prisma } from "./db";
import {
  fileCountOrders,
  fileCreateOrder,
  fileListOrders,
  fileUpdateOrderStatus,
  type StoredOrder,
} from "./orders-file-store";

export type OrderRecord = StoredOrder;

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  productName: string;
  productSlug?: string;
  quantity: number;
  unitPrice: number;
  comment?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<OrderRecord> {
  const totalAmount = input.unitPrice * input.quantity;
  const payload = {
    customerName: input.customerName,
    phone: input.phone,
    whatsapp: input.whatsapp ?? null,
    address: input.address,
    city: input.city,
    productName: input.productName,
    productSlug: input.productSlug ?? null,
    quantity: input.quantity,
    unitPrice: input.unitPrice,
    totalAmount,
    comment: input.comment ?? null,
    status: "PENDING" as OrderStatus,
  };

  if (isDatabaseConfigured()) {
    const order = await prisma.order.create({ data: payload });
    return {
      ...order,
      createdAt: order.createdAt.toISOString(),
      whatsapp: order.whatsapp,
      productSlug: order.productSlug,
      comment: order.comment,
    };
  }

  return fileCreateOrder(payload);
}

export async function listOrders(): Promise<OrderRecord[]> {
  if (isDatabaseConfigured()) {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return orders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
    }));
  }
  return fileListOrders();
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<OrderRecord | null> {
  if (isDatabaseConfigured()) {
    try {
      const order = await prisma.order.update({
        where: { id },
        data: { status },
      });
      return {
        ...order,
        createdAt: order.createdAt.toISOString(),
      };
    } catch {
      return null;
    }
  }
  return fileUpdateOrderStatus(id, status);
}

export async function countOrders(): Promise<number> {
  if (isDatabaseConfigured()) {
    return prisma.order.count();
  }
  return fileCountOrders();
}

export async function getOrderStats() {
  const orders = await listOrders();
  const byStatus = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const revenue = orders
    .filter((o) => o.status !== "CANCELED")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  return {
    total: orders.length,
    byStatus,
    revenue,
  };
}
