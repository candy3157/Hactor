const fs = require("fs");
const path = require("path");

const targetPath = path.join(
  __dirname,
  "..",
  "node_modules",
  ".prisma",
  "client",
  "default.js",
);

const patchedContent =
  "module.exports = {\n  ...require('./index.js'),\n};\n";

if (!fs.existsSync(targetPath)) {
  console.warn(`[patch-prisma-client] not found: ${targetPath}`);
  process.exit(0);
}

const current = fs.readFileSync(targetPath, "utf8");
if (current.includes("require('./index.js')")) {
  console.log("[patch-prisma-client] already patched");
  process.exit(0);
}

fs.writeFileSync(targetPath, patchedContent, "utf8");
console.log("[patch-prisma-client] patched node_modules/.prisma/client/default.js");
