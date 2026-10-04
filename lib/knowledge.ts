import fs from "node:fs/promises";
import path from "node:path";

export async function loadCreatorKnowledge(): Promise<string> {
  const filePath = path.join(process.cwd(), "knowledge", "creator.md");
  return fs.readFile(filePath, "utf8");
}
