const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const distRendererDir = path.join(rootDir, "dist-electron", "renderer");
const srcRendererDir = path.join(rootDir, "src", "renderer");

if (!fs.existsSync(distRendererDir)) {
  fs.mkdirSync(distRendererDir, { recursive: true });
}

for (const file of ["index.html", "app.js"]) {
  const src = path.join(srcRendererDir, file);
  const dest = path.join(distRendererDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[Build] Copied ${file} -> dist-electron/renderer/`);
  }
}
