import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { listOrders } from "@/lib/orders";
import { ORDER_STATUSES } from "@/lib/config";

function checkAuth(req: NextRequest): boolean {
  const token = process.env.ADMIN_SECRET;
  return Boolean(token && req.headers.get("authorization") === `Bearer ${token}`);
}

function ordersToRows(
  orders: Awaited<ReturnType<typeof listOrders>>
) {
  return orders.map((o) => ({
    ID: o.id,
    Date: new Date(o.createdAt).toLocaleString("fr-FR"),
    Client: o.customerName,
    Téléphone: o.phone,
    WhatsApp: o.whatsapp ?? "",
    Adresse: o.address,
    Ville: o.city,
    Produit: o.productName,
    Quantité: o.quantity,
    "Prix unitaire": o.unitPrice,
    Total: o.totalAmount,
    Statut:
      ORDER_STATUSES[o.status as keyof typeof ORDER_STATUSES]?.label ?? o.status,
    Commentaire: o.comment ?? "",
  }));
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const format = req.nextUrl.searchParams.get("format") ?? "csv";
  const orders = await listOrders();
  const rows = ordersToRows(orders);

  if (format === "xlsx" || format === "excel") {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Commandes");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return new NextResponse(buf, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="commandes-zayr.xlsx"',
      },
    });
  }

  const ws = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="commandes-zayr.csv"',
    },
  });
}
