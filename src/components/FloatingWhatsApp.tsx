"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/config";

export function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300"
      aria-label="Contacter ZAYR SHOP sur WhatsApp"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  );
}
