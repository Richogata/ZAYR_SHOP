"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setEmail("");
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-full border border-stone-300 px-4 py-3 focus:border-gold-500 focus:outline-none"
        aria-label="Email newsletter"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-gold-600 px-6 py-3 font-semibold text-white hover:bg-gold-700 disabled:opacity-60"
      >
        S&apos;inscrire
      </button>
      {status === "ok" && (
        <p className="text-sm text-green-600 sm:col-span-2">
          Merci pour votre inscription !
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 sm:col-span-2">
          Erreur lors de l&apos;inscription.
        </p>
      )}
    </form>
  );
}
