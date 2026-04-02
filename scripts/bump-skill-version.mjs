import { readFileSync, writeFileSync } from "node:fs";

const version = JSON.parse(readFileSync("package.json", "utf-8")).version;
const skillPath = "skills/ja4-parsing/SKILL.md";
const content = readFileSync(skillPath, "utf-8");
const updated = content.replace(/library_version:\s*"[^"]*"/, `library_version: "${version}"`);

if (updated === content) {
  throw new Error(`Failed to update library_version in ${skillPath}: pattern not found.`);
}

writeFileSync(skillPath, updated, "utf-8");
