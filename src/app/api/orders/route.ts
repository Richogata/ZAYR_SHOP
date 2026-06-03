import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/orders";
import {
  buildOrderWhatsAppMessage,
  getWhatsAppOrderUrl,
} from "@/lib/whatsapp";

const schema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(6),
  whatsapp: z.string().optional(),
  address: z.string().min(5),
  city: z.string().min(2),
  productSlug: z.string().optional(),
  productName: z.string().min(2),
  unitPrice: z.number().positive(),
  quantity: z.number().int().min(1).max(99),
  comment: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const totalAmount = data.unitPrice * data.quantity;

    const order = await createOrder({
      customerName: data.customerName,
      phone: data.phone,
      whatsapp: data.whatsapp,
      address: data.address,
      city: data.city,
      productName: data.productName,
      productSlug: data.productSlug,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      comment: data.comment,
    });

    const message = buildOrderWhatsAppMessage({
      customerName: data.customerName,
      phone: data.phone,
      address: `${data.address}, ${data.city}`,
      city: data.city,
      productName: data.productName,
      quantity: data.quantity,
      totalAmount,
      comment: data.comment,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      whatsappUrl: getWhatsAppOrderUrl(message),
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: e.flatten() },
        { status: 400 }
      );
    }
    console.error(e);
    return NextResponse.json(
      { error: "Impossible d'enregistrer la commande" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const token = process.env.ADMIN_SECRET;
  if (!token || auth !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { listOrders } = await import("@/lib/orders");
  const orders = await listOrders();
  return NextResponse.json({ orders });
}
