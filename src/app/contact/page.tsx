import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { STORE, WHATSAPP_URL } from "@/lib/config";
import { Mail, MessageCircle, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez ZAYR SHOP par WhatsApp, email ou formulaire.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <h1 className="font-serif text-4xl font-bold">Contact</h1>
      <p className="mt-2 text-stone-600">
        Notre équipe vous répond rapidement sur WhatsApp.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl bg-[#25D366] p-6 text-white transition hover:bg-[#1da851]"
          >
            <MessageCircle className="h-10 w-10" />
            <div>
              <p className="font-bold">WhatsApp</p>
              <p>{STORE.whatsapp}</p>
            </div>
          </a>
          <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-6">
            <Mail className="h-8 w-8 text-gold-600" />
            <div>
              <p className="font-bold">Email</p>
              <a href={`mailto:${STORE.email}`} className="text-stone-600 hover:text-gold-700">
                {STORE.email}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-6">
            <Phone className="h-8 w-8 text-gold-600" />
            <div>
              <p className="font-bold">Téléphone / WhatsApp</p>
              <p className="text-stone-600">{STORE.whatsapp}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Formulaire de contact</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
