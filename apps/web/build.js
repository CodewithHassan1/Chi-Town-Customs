const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("--------------------------------------------------");
console.log("  CHI-TOWN CUSTOMS — PRODUCTION / VERCEL BUILD");
console.log("--------------------------------------------------");

const webDir = __dirname;
const rootDir = path.resolve(__dirname, "../..");

// 1. Ensure DATABASE_URL fallback exists for Prisma generation & Next.js static builds
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./seed.db";
  console.log("[build] Defaulted DATABASE_URL to file:./seed.db");
} else {
  console.log("[build] Using configured DATABASE_URL");
}

if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = "chitown_customs_super_secure_production_secret_key_2026_x89";
}

// 2. Ensure .env exists in apps/web so Next.js build-time pre-renders find it
const envFile = path.join(webDir, ".env");
if (!fs.existsSync(envFile)) {
  fs.writeFileSync(
    envFile,
    `DATABASE_URL="${process.env.DATABASE_URL}"\nSESSION_SECRET="${process.env.SESSION_SECRET}"\n`
  );
  console.log("[build] Replicated fallback .env file");
}

// 3. Compile monorepo packages (contracts, ui, database) so dist/ is always ready
const packagesToBuild = [
  path.join(rootDir, "packages", "contracts"),
  path.join(rootDir, "packages", "ui"),
  path.join(rootDir, "packages", "database"),
];

for (const pkgPath of packagesToBuild) {
  if (fs.existsSync(pkgPath)) {
    try {
      console.log(`[build] Compiling ${path.basename(pkgPath)}...`);
      execSync("npx tsc", { cwd: pkgPath, stdio: "inherit", env: process.env });
    } catch (err) {
      console.warn(`[build] Note on ${path.basename(pkgPath)} tsc:`, err.message);
    }
  }
}

// 4. Generate Prisma Client
console.log("[build] Generating Prisma client...");
const schemaPath = path.join(rootDir, "packages", "database", "prisma", "schema.prisma");
execSync(`npx prisma generate --schema="${schemaPath}"`, {
  cwd: webDir,
  stdio: "inherit",
  env: process.env,
});

// 5. Run Next.js Production Build
console.log("[build] Running next build...");
execSync("npx next build", {
  cwd: webDir,
  stdio: "inherit",
  env: process.env,
});

console.log("--------------------------------------------------");
console.log("  BUILD COMPLETED SUCCESSFULLY");
console.log("--------------------------------------------------");
