/**
 * Usage: npx tsx scripts/import-products-zip.ts chemin/vers/produits.zip
 */
import { readFileSync } from "fs";
import { importProductsFromZip } from "../src/lib/import-zip";

const zipPath = process.argv[2];
if (!zipPath) {
  console.error("Usage: npx tsx scripts/import-products-zip.ts <fichier.zip>");
  process.exit(1);
}

const buffer = readFileSync(zipPath);
importProductsFromZip(buffer).then((result) => {
  console.log("Import terminé:", result);
});
