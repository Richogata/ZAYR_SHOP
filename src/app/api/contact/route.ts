import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

const FILE = path.join(process.cwd(), "data", "contacts.json");

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());

    if (isDatabaseConfigured()) {
      await prisma.contactMessage.create({ data });
    } else {
      let list: unknown[] = [];
      try {
        list = JSON.parse(await fs.readFile(FILE, "utf-8")) as unknown[];
      } catch {
        /* empty */
      }
      list.push({ ...data, createdAt: new Date().toISOString() });
      await fs.mkdir(path.dirname(FILE), { recursive: true });
      await fs.writeFile(FILE, JSON.stringify(list, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
