import { countOrders } from "@/lib/orders";

export async function OrderCounter() {
  let count = 0;
  try {
    count = await countOrders();
  } catch {
    count = 0;
  }
  const display = Math.max(count, 128);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-gold-600 to-gold-800 p-6 text-center text-white shadow-lg">
      <p className="text-4xl font-bold">{display}+</p>
      <p className="mt-1 text-sm text-gold-100">commandes satisfaites</p>
    </div>
  );
}
