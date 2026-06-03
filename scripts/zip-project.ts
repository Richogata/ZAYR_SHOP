import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

async function zipFolder() {
  const zip = new AdmZip();
  const rootDir = path.join(process.cwd());
  const publicDir = path.join(rootDir, "public");
  
  // Create output path in public directory (so user can download from running app)
  const zipName = "zayr-shop.zip";
  const outputPathPublic = path.join(publicDir, zipName);
  
  // Create output path in artifact directory (so it is easily accessible in the chat)
  const artifactDir = "C:/Users/DELL/.gemini/antigravity/brain/aef38834-9855-47a8-b68c-4ee86020ff58";
  const outputPathArtifact = path.join(artifactDir, zipName);

  console.log("Démarrage de la compression du projet...");

  function addDirToZip(dir: string, zipPath: string = "") {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativeZipPath = zipPath ? `${zipPath}/${item}` : item;
      
      // Exclusions
      if (
        item === "node_modules" ||
        item === ".next" ||
        item === ".git" ||
        item === "zayr-shop.zip" ||
        item === ".env"
      ) {
        continue;
      }

      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        addDirToZip(fullPath, relativeZipPath);
      } else {
        zip.addLocalFile(fullPath, zipPath);
      }
    }
  }

  addDirToZip(rootDir);

  // Write to public folder
  console.log(`Écriture du zip vers : ${outputPathPublic}`);
  zip.writeZip(outputPathPublic);

  // Ensure artifact directory exists and write there as well
  if (fs.existsSync(artifactDir)) {
    console.log(`Écriture du zip vers l'artéfact : ${outputPathArtifact}`);
    zip.writeZip(outputPathArtifact);
  }

  console.log("Compression terminée avec succès !");
}

zipFolder().catch(console.error);
