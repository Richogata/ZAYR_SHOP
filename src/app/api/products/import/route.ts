import { NextRequest, NextResponse } from "next/server";
import { importProductsFromZip } from "@/lib/import-zip";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const token = process.env.ADMIN_SECRET;
  if (!token || auth !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Fichier ZIP requis" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await importProductsFromZip(buffer);
  return NextResponse.json(result);
}
