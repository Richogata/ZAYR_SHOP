"use client";

import { useCallback, useEffect, useState } from "react";
import { ORDER_STATUSES } from "@/lib/config";
import type { OrderRecord } from "@/lib/orders";
import { HelixLoader } from "./HelixLoader";

type OrderStatus = keyof typeof ORDER_STATUSES;

export function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    revenue: number;
    byStatus: Record<string, number>;
  } | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const list: OrderRecord[] = data.orders;
      setOrders(list);
      const byStatus = list.reduce(
        (acc, o) => {
          acc[o.status] = (acc[o.status] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
      const revenue = list
        .filter((o) => o.status !== "CANCELED")
        .reduce((s, o) => s + o.totalAmount, 0);
      setStats({ total: list.length, revenue, byStatus });
    } catch {
      setError("Session expirée ou erreur de chargement");
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token, authHeaders]);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? sessionStorage.getItem("admin_token")
        : null;
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("admin_token", token);
      loadOrders();
    }
  }, [token, loadOrders]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Erreur");
      return;
    }
    if (data.token) setToken(data.token);
  }

  async function updateStatus(id: string, status: OrderStatus) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) loadOrders();
  }

  async function exportData(format: "csv" | "xlsx") {
    if (!token) return;
    const res = await fetch(`/api/orders/export?format=${format}`, {
      headers: authHeaders(),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = format === "xlsx" ? "commandes-zayr.xlsx" : "commandes-zayr.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.productName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  );

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
        <h1 className="font-serif text-3xl font-bold">Administration</h1>
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <input
            type="password"
            placeholder="Mot de passe admin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-stone-900 py-3 font-bold text-white"
          >
            Connexion
          </button>
        </form>
        <p className="mt-4 text-xs text-stone-500">
          Configurez ADMIN_PASSWORD et ADMIN_SECRET dans les variables
          d&apos;environnement.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold">Tableau de bord</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => exportData("csv")}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-stone-50"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => exportData("xlsx")}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-stone-50"
          >
            Export Excel
          </button>
        </div>
      </div>

      {stats && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-gold-50 p-6">
            <p className="text-3xl font-bold text-gold-800">{stats.total}</p>
            <p className="text-sm text-stone-600">Commandes totales</p>
          </div>
          <div className="rounded-xl bg-green-50 p-6">
            <p className="text-3xl font-bold text-green-800">
              {stats.revenue.toLocaleString("fr-FR")} FCFA
            </p>
            <p className="text-sm text-stone-600">Chiffre d&apos;affaires</p>
          </div>
          <div className="rounded-xl bg-stone-100 p-6">
            <p className="text-sm text-stone-600">Par statut</p>
            <ul className="mt-2 space-y-1 text-sm">
              {Object.entries(stats.byStatus).map(([k, v]) => (
                <li key={k}>
                  {ORDER_STATUSES[k as OrderStatus]?.label ?? k}: {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <input
        type="search"
        placeholder="Rechercher une commande..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-8 w-full max-w-md rounded-xl border px-4 py-3"
      />

      {loading ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-2">
          <HelixLoader size={45} speed={2.5} color="#c2410c" />
          <p className="text-sm font-semibold tracking-wider text-stone-500 uppercase animate-pulse">
            Chargement des commandes...
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Client</th>
                <th className="p-3">Produit</th>
                <th className="p-3">Total</th>
                <th className="p-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b hover:bg-stone-50">
                  <td className="p-3 font-mono text-xs">{o.id.slice(0, 12)}…</td>
                  <td className="p-3">
                    {new Date(o.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-3">
                    <div>{o.customerName}</div>
                    <div className="text-stone-500">{o.phone}</div>
                  </td>
                  <td className="p-3">
                    {o.productName} ×{o.quantity}
                  </td>
                  <td className="p-3 font-medium">
                    {o.totalAmount.toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) =>
                        updateStatus(o.id, e.target.value as OrderStatus)
                      }
                      className="rounded border px-2 py-1"
                    >
                      {Object.keys(ORDER_STATUSES).map((s) => (
                        <option key={s} value={s}>
                          {ORDER_STATUSES[s as OrderStatus].label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-8 text-center text-stone-500">Aucune commande</p>
          )}
        </div>
      )}
    </div>
  );
}
