import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Crée les tables si elles n'existent pas (Prisma les crée automatiquement via la connexion)
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN
          CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELED');
        END IF;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Order" (
        id TEXT PRIMARY KEY,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "customerName" TEXT NOT NULL,
        phone TEXT NOT NULL,
        whatsapp TEXT,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        "productName" TEXT NOT NULL,
        "productSlug" TEXT,
        quantity INTEGER NOT NULL,
        "unitPrice" INTEGER NOT NULL,
        "totalAmount" INTEGER NOT NULL,
        comment TEXT,
        status "OrderStatus" NOT NULL DEFAULT 'PENDING'
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ContactMessage" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Créer aussi les index
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"(status);`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_customerName_idx" ON "Order"("customerName");`);

    return NextResponse.json({ success: true, message: "Base de données initialisée avec succès!" });
  } catch (error) {
    console.error("Init DB error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
