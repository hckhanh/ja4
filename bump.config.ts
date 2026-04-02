import { defineConfig } from "bumpp";

export default defineConfig({
  files: ["package.json", "jsr.json"],
  execute: "node scripts/bump-skill-version.mjs",
  sign: true,
  all: true,
});
