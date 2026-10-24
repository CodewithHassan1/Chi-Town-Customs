const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist-electron");
const distRendererDir = path.join(distDir, "renderer");
const srcRendererDir = path.join(rootDir, "src", "renderer");

// 1. Ensure dist directories exist
if (!fs.existsSync(distRendererDir)) {
  fs.mkdirSync(distRendererDir, { recursive: true });
}

// 2. Copy renderer files to dist-electron
const rendererFiles = ["index.html", "app.js"];
for (const file of rendererFiles) {
  const src = path.join(srcRendererDir, file);
  const dest = path.join(distRendererDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[Desktop Dev] Copied ${file} -> dist-electron/renderer/`);
  }
}

// 3. Compile TypeScript
console.log("[Desktop Dev] Compiling main & preload TypeScript...");
const tsc = spawn("npx", ["tsc"], { cwd: rootDir, shell: true, stdio: "inherit" });

tsc.on("close", (code) => {
  if (code !== 0) {
    console.error(`[Desktop Dev] TypeScript compilation failed with code ${code}`);
    process.exit(code);
  }

  console.log("[Desktop Dev] Launching Electron window...");
  const electronProcess = spawn("npx", ["electron", "."], {
    cwd: rootDir,
    shell: true,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "development" },
  });

  electronProcess.on("close", (exitCode) => {
    console.log(`[Desktop Dev] Electron exited with code ${exitCode}`);
    process.exit(exitCode || 0);
  });
});
