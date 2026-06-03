import { AlertTriangle } from "lucide-react";
import { ANTI_FAKE_ORDER_MESSAGE } from "@/lib/config";

export function AntiFakeOrderAlert() {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <p>{ANTI_FAKE_ORDER_MESSAGE}</p>
    </div>
  );
}
