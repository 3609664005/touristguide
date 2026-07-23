"use server";

import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/session";

interface EntityItem {
  id: string;
  name: string;
  [key: string]: unknown;
}

function isValidSlug(slug: unknown): slug is string {
  return typeof slug === "string" && slug.length > 0 && slug.length <= 100 && /^[a-zA-Z0-9-]+$/.test(slug);
}

const DATA_DIR = path.join(process.cwd(), "data");

function readLocalEntities(): EntityItem[] {
  const filePath = path.join(DATA_DIR, "entities.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as EntityItem[];
  } catch { return []; }
}

function writeLocalEntities(entities: EntityItem[]): void {
  const filePath = path.join(DATA_DIR, "entities.json");
  fs.writeFileSync(filePath, JSON.stringify(entities, null, 2) + "\n", "utf-8");
}

export async function deleteEntity(slug: string, entityName: string, token: string): Promise<{ success: boolean }> {
  const authHeader = `Bearer ${token}`;
  if (!await verifyToken(authHeader)) {
    throw new Error("UNAUTHORIZED");
  }
  if (!isValidSlug(slug)) throw new Error("INVALID_SLUG");

  const entities = readLocalEntities();
  const idx = entities.findIndex((e) => String(e.id).trim() === slug);
  if (idx === -1) throw new Error(`未找到 slug 为 "${slug}" 的实体`);

  entities.splice(idx, 1);
  writeLocalEntities(entities);
  return { success: true };
}