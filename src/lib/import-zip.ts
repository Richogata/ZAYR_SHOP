import AdmZip from "adm-zip";
import { promises as fs } from "fs";
import path from "path";

interface ProductMeta {
  slug: string;
  name: string;
  price: number;
  shortDescription: string;
  description: string;
  category: string;
  images: string[];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseMetaFile(content: string): Partial<ProductMeta> {
  const lines = content.split(/\r?\n/);
  const meta: Record<string, string> = {};
  for (const line of lines) {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) meta[key.trim().toLowerCase()] = rest.join(":").trim();
  }
  return {
    name: meta.nom ?? meta.name ?? meta.titre,
    price: meta.prix ? parseInt(meta.prix.replace(/\D/g, ""), 10) : undefined,
    shortDescription: meta.description_courte ?? meta.resume,
    description: meta.description,
    category: meta.categorie ?? meta.category ?? "beaute-bien-etre",
  };
}

export async function importProductsFromZip(zipBuffer: Buffer) {
  const zip = new AdmZip(zipBuffer);
  const entries = zip.getEntries();
  const publicProducts = path.join(process.cwd(), "public", "products");
  await fs.mkdir(publicProducts, { recursive: true });

  const productsMap = new Map<string, ProductMeta>();
  let imagesCopied = 0;

  for (const entry of entries) {
    if (entry.isDirectory) continue;
    const name = entry.entryName.replace(/\\/g, "/");
    const base = path.basename(name);
    const folder = path.dirname(name).split("/").pop() ?? "import";

    if (/\.(png|jpe?g|webp|gif)$/i.test(base)) {
      const slug = slugify(folder !== "." && folder !== "import" ? folder : base.replace(/\.[^.]+$/, ""));
      const ext = path.extname(base);
      const filename = `${slug}-${Date.now()}-${imagesCopied}${ext}`;
      const outPath = path.join(publicProducts, filename);
      await fs.writeFile(outPath, entry.getData());
      imagesCopied++;

      const existing = productsMap.get(slug) ?? {
        slug,
        name: folder.replace(/-/g, " "),
        price: 10000,
        shortDescription: "Produit importé depuis ZIP",
        description: "Description à compléter.",
        category: "beaute-bien-etre",
        images: [],
      };
      existing.images.push(`/products/${filename}`);
      productsMap.set(slug, existing);
    }

    if (/products\.json$/i.test(name)) {
      const json = JSON.parse(entry.getData().toString("utf-8")) as {
        products?: ProductMeta[];
      };
      if (json.products) {
        for (const p of json.products) {
          productsMap.set(p.slug, { ...p, images: p.images ?? [] });
        }
      }
    }

    if (/meta\.txt$/i.test(name) || /readme\.txt$/i.test(name)) {
      const folderSlug = slugify(path.dirname(name).split("/").pop() ?? "produit");
      const meta = parseMetaFile(entry.getData().toString("utf-8"));
      const existing = productsMap.get(folderSlug) ?? {
        slug: folderSlug,
        name: folderSlug,
        price: 10000,
        shortDescription: "",
        description: "",
        category: "beaute-bien-etre",
        images: [],
      };
      productsMap.set(folderSlug, {
        ...existing,
        ...meta,
        slug: folderSlug,
        name: meta.name ?? existing.name,
        price: meta.price ?? existing.price,
      } as ProductMeta);
    }
  }

  const products = Array.from(productsMap.values()).map((p, i) => ({
    id: String(Date.now() + i),
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription || p.description.slice(0, 120),
    description: p.description,
    price: p.price,
    currency: "FCFA",
    category: p.category,
    images: p.images.length ? p.images : ["/products/placeholder.png"],
    benefits: ["Qualité premium", "Livraison rapide"],
    featured: false,
    popular: false,
    recommended: false,
    inStock: true,
  }));

  const dataPath = path.join(process.cwd(), "data", "products.json");
  let existing: { categories: unknown[]; products: unknown[] } = {
    categories: [],
    products: [],
  };
  try {
    existing = JSON.parse(await fs.readFile(dataPath, "utf-8"));
  } catch {
    /* use default categories from current file */
    const current = await import("../../data/products.json");
    existing.categories = current.categories;
  }

  const merged = {
    categories: existing.categories,
    products: [...(existing.products as typeof products), ...products],
  };

  await fs.writeFile(dataPath, JSON.stringify(merged, null, 2), "utf-8");

  return {
    imported: products.length,
    imagesCopied,
    products,
  };
}
