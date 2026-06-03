"use client";

import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setForm({ name: "", email: "", phone: "", message: "" });
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        required
        placeholder="Nom *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full rounded-xl border border-stone-300 px-4 py-3"
      />
      <input
        required
        type="email"
        placeholder="Email *"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full rounded-xl border border-stone-300 px-4 py-3"
      />
      <input
        type="tel"
        placeholder="Téléphone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full rounded-xl border border-stone-300 px-4 py-3"
      />
      <textarea
        required
        rows={5}
        placeholder="Message *"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full rounded-xl border border-stone-300 px-4 py-3"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-gold-600 py-3 font-bold text-white hover:bg-gold-700 disabled:opacity-60"
      >
        {status === "loading" ? "Envoi..." : "Envoyer"}
      </button>
      {status === "ok" && (
        <p className="text-sm text-green-600">Message envoyé avec succès !</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">Erreur lors de l&apos;envoi.</p>
      )}
    </form>
  );
}
