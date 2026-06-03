"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import { getAllProducts, formatPrice } from "@/lib/products";
import { AntiFakeOrderAlert } from "./AntiFakeOrderAlert";
import { HelixLoader } from "./HelixLoader";

interface OrderFormProps {
  preselectedSlug?: string;
  preselectedQuantity?: number;
}

export function OrderForm({
  preselectedSlug,
  preselectedQuantity = 1,
}: OrderFormProps) {
  const router = useRouter();
  const products = getAllProducts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    productSlug: preselectedSlug ?? products[0]?.slug ?? "",
    quantity: preselectedQuantity,
    comment: "",
  });

  const selected = products.find((p) => p.slug === form.productSlug);
  const total = selected ? selected.price * form.quantity : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          productName: selected?.name,
          unitPrice: selected?.price,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de la commande");
      if (data.whatsappUrl) {
        window.location.href = data.whatsappUrl;
      } else {
        router.push("/catalogue?ordered=1");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AntiFakeOrderAlert />
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nom complet *"
          value={form.customerName}
          onChange={(v) => setForm({ ...form, customerName: v })}
          required
        />
        <Field
          label="Téléphone *"
          type="tel"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
          required
        />
        <Field
          label="WhatsApp"
          type="tel"
          value={form.whatsapp}
          onChange={(v) => setForm({ ...form, whatsapp: v })}
        />
        <Field
          label="Ville *"
          value={form.city}
          onChange={(v) => setForm({ ...form, city: v })}
          required
        />
      </div>
      <Field
        label="Adresse complète *"
        value={form.address}
        onChange={(v) => setForm({ ...form, address: v })}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Produit *
          </label>
          <select
            required
            value={form.productSlug}
            onChange={(e) =>
              setForm({ ...form, productSlug: e.target.value })
            }
            className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200"
          >
            {products.map((p: Product) => (
              <option key={p.slug} value={p.slug}>
                {p.name} — {formatPrice(p.price)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Quantité *
          </label>
          <input
            type="number"
            min={1}
            max={99}
            required
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: parseInt(e.target.value, 10) || 1 })
            }
            className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Commentaire
        </label>
        <textarea
          rows={3}
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200"
          placeholder="Instructions de livraison, préférences..."
        />
      </div>
      {selected && (
        <p className="rounded-xl bg-gold-50 p-4 text-center text-lg font-bold text-gold-800">
          Montant total : {formatPrice(total, selected.currency)}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#25D366] py-4 text-lg font-bold text-white shadow-lg transition hover:bg-[#1da851] disabled:opacity-60 flex justify-center items-center"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <HelixLoader size={24} speed={2.0} color="white" />
            Envoi en cours...
          </span>
        ) : (
          "Valider et commander sur WhatsApp"
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200"
      />
    </div>
  );
}
