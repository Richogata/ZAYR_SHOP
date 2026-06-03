import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateOrderStatus } from "@/lib/orders";
import type { OrderStatus } from "@prisma/client";

function checkAuth(req: NextRequest): boolean {
  const token = process.env.ADMIN_SECRET;
  return Boolean(token && req.headers.get("authorization") === `Bearer ${token}`);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const schema = z.object({
    status: z.enum([
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELED",
    ]),
  });
  const { status } = schema.parse(body);
  const order = await updateOrderStatus(id, status as OrderStatus);
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }
  return NextResponse.json({ order });
}
