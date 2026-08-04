import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/session";
import { updateGitHubFile } from "@/lib/github";
import { getAllGuides } from "@/lib/guides";
import type { Guide } from "@/lib/guides";

export async function GET() {
  try {
    const guides = getAllGuides();
    return NextResponse.json(guides);
  } catch {
    return NextResponse.json([]);
  }
}

function validateGuide(body: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
    errors.push("标题不能为空");
  }
  if (!body.slug || typeof body.slug !== "string") {
    errors.push("slug 不能为空");
  } else if (!/^[a-z0-9-]+$/.test(body.slug as string)) {
    errors.push("slug 只允许小写英文、数字和连字符");
  }
  if (!body.category || typeof body.category !== "string" || body.category.trim() === "") {
    errors.push("分类不能为空");
  }
  try { JSON.stringify(body); } catch { errors.push("数据包含无法序列化的内容"); }
  return errors.length === 0 ? { valid: true, errors: [] } : { valid: false, errors };
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!await verifyToken(authHeader)) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateGuide(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join("；") }, { status: 400 });
    }

    const allGuides = getAllGuides();
    const existingIndex = allGuides.findIndex((g) => g.slug === body.slug);

    const newGuide: Guide = {
      slug: body.slug,
      title: body.title,
      description: body.description || "",
      category: body.category,
      tags: Array.isArray(body.tags) ? body.tags : [],
      publishedAt: body.publishedAt || new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      content: body.content || "",
      relatedEntities: Array.isArray(body.relatedEntities) ? body.relatedEntities : [],
      status: body.status === "hidden" ? "hidden" : "published",
    };

    if (existingIndex >= 0) {
      newGuide.publishedAt = allGuides[existingIndex].publishedAt;
      allGuides[existingIndex] = newGuide;
    } else {
      allGuides.push(newGuide);
    }

    const newContent = JSON.stringify(allGuides, null, 2);
    const commitMsg = existingIndex >= 0
      ? `更新攻略: ${newGuide.title}`
      : `新增攻略: ${newGuide.title}`;

    const writeResult = await updateGitHubFile("data/guides.json", newContent, commitMsg);

    return NextResponse.json({ success: true, debug: writeResult });
  } catch (err) {
    const message = err instanceof Error ? err.message : "保存失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!await verifyToken(authHeader)) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, status } = body as { slug?: string; status?: string };

    if (!slug || !status || !["published", "hidden"].includes(status)) {
      return NextResponse.json({ error: "参数无效" }, { status: 400 });
    }

    const allGuides = getAllGuides();
    const idx = allGuides.findIndex((g) => g.slug === slug);
    if (idx === -1) {
      return NextResponse.json({ error: "攻略不存在" }, { status: 404 });
    }

    allGuides[idx] = {
      ...allGuides[idx],
      status: status as "published" | "hidden",
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    const newContent = JSON.stringify(allGuides, null, 2);
    const action = status === "hidden" ? "隐藏" : "恢复";
    const commitMsg = `${action}攻略: ${allGuides[idx].title}`;

    const writeResult = await updateGitHubFile("data/guides.json", newContent, commitMsg);

    return NextResponse.json({ success: true, debug: writeResult });
  } catch (err) {
    const message = err instanceof Error ? err.message : "操作失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
