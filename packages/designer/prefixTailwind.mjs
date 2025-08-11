import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function prefixTailwindClassesInFile(filePath) {
  let content = await fs.readFile(filePath, "utf8");
  const prefix = "ak:";

  // Regex to find Tailwind classes in className strings (simple example)
  const classRegex = /className="([^"]*)"/g;

  content = content.replace(classRegex, (match, classes) => {
    const prefixedClasses = classes
      .split(" ")
      .map((cls) => (cls.startsWith(prefix) ? cls : prefix + cls))
      .join(" ");
    return `className="${prefixedClasses}"`;
  });

  await fs.writeFile(filePath, content, "utf8");
}

async function processDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDir(fullPath);
    } else if (fullPath.match(/\.(js|jsx|tsx)$/)) {
      await prefixTailwindClassesInFile(fullPath);
      console.log(`Processed: ${fullPath}`);
    }
  }
}

const sourceDir = path.join(__dirname, "src");

processDir(sourceDir)
  .then(() => console.log("Prefixing complete!"))
  .catch(console.error);
