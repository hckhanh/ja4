import { readFileSync, writeFileSync } from "node:fs";

const version = JSON.parse(readFileSync("package.json", "utf-8")).version;
const skillPath = "skills/ja4-parsing/SKILL.md";
const content = readFileSync(skillPath, "utf-8");
const updated = content.replace(/library_version:\s*"[^"]*"/, `library_version: "${version}"`);
writeFileSync(skillPath, updated, "utf-8");
