import { HelixLoader } from "@/components/HelixLoader";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <HelixLoader size={60} speed={2.5} color="#c2410c" />
      <p className="text-sm font-semibold tracking-wider text-stone-500 uppercase animate-pulse">
        Chargement...
      </p>
    </div>
  );
}
