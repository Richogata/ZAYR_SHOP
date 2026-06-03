import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

const schema = z.object({ email: z.string().email() });

const FILE = path.join(process.cwd(), "data", "newsletter.json");

export async function POST(req: NextRequest) {
  try {
    const { email } = schema.parse(await req.json());

    if (isDatabaseConfigured()) {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        create: { email },
        update: {},
      });
    } else {
      let list: string[] = [];
      try {
        list = JSON.parse(await fs.readFile(FILE, "utf-8")) as string[];
      } catch {
        /* empty */
      }
      if (!list.includes(email)) list.push(email);
      await fs.mkdir(path.dirname(FILE), { recursive: true });
      await fs.writeFile(FILE, JSON.stringify(list, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }
}
