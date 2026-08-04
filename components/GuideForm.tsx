"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Entity } from "@/lib/entities";

interface GuideFormData {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  content: string;
  relatedEntities: string[];
}

interface GuideFormProps {
  initialData?: GuideFormData;
  isEditing?: boolean;
}

const PRESET_CATEGORIES = ["路线攻略", "亲子游", "美食路线", "住宿推荐", "季节限定"];

function slugFromTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (slug && /[a-z0-9]/.test(slug)) return slug;
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `guide-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`;
}

export default function GuideForm({ initialData, isEditing }: GuideFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [manualSlug, setManualSlug] = useState(!isEditing);

  const [form, setForm] = useState<GuideFormData>(
    initialData || {
      slug: "", title: "", description: "", category: PRESET_CATEGORIES[0],
      tags: "", content: "", relatedEntities: [],
    }
  );

  useEffect(() => {
    fetch("/admin/api/entities", {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin-token")}` },
    })
      .then((r) => r.json())
      .then((data) => setEntities(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const updateField = <K extends keyof GuideFormData>(key: K, value: GuideFormData[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !isEditing && !manualSlug) {
        next.slug = slugFromTitle(value as string);
      }
      return next;
    });
  };

  const toggleEntity = (entityId: string) => {
    setForm((prev) => {
      const list = prev.relatedEntities.includes(entityId)
        ? prev.relatedEntities.filter((id) => id !== entityId)
        : [...prev.relatedEntities, entityId];
      return { ...prev, relatedEntities: list };
    });
  };

  const handleSlugFocus = () => { setManualSlug(true); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        slug: form.slug,
        title: form.title,
        description: form.description,
        category: form.category,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        content: form.content,
        relatedEntities: form.relatedEntities,
      };

      const token = localStorage.getItem("admin-token");
      const res = await fetch("/admin/api/guides", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "保存失败");
      } else {
        setSuccess("已提交，1-2 分钟后生效");
        if (!isEditing) {
          setForm({
            slug: "", title: "", description: "", category: PRESET_CATEGORIES[0],
            tags: "", content: "", relatedEntities: [],
          });
          setManualSlug(false);
        }
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
      {success && <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{success}</div>}

      {/* 标题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
        <input
          type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} required
          placeholder="例如：万宁兴隆亲子一日游路线"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">slug *</label>
        <input
          type="text" value={form.slug} onChange={(e) => updateField("slug", e.target.value)}
          onFocus={handleSlugFocus} required disabled={isEditing}
          placeholder="wanning-xinglong-family-trip"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 font-mono text-sm"
        />
        <p className="mt-1 text-xs text-gray-400">
          {isEditing ? "编辑模式下 slug 不可修改" : "输入标题后自动生成；若无法生成则使用 guide-时间戳。也可手动修改"}
        </p>
      </div>

      {/* 简介 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
        <textarea
          value={form.description} onChange={(e) => updateField("description", e.target.value)}
          placeholder="简要介绍这条路线或攻略的内容..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-y"
        />
      </div>

      {/* 分类 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">分类 *</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat} type="button"
              onClick={() => updateField("category", cat)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                form.category === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 标签 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
        <input
          type="text" value={form.tags} onChange={(e) => updateField("tags", e.target.value)}
          placeholder="用逗号分隔，例如：万宁旅游, 兴隆旅游, 亲子游"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 正文 Markdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">正文 (Markdown)</label>
        <textarea
          value={form.content} onChange={(e) => updateField("content", e.target.value)}
          placeholder="使用 Markdown 格式编写攻略内容..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 h-64 resize-y font-mono text-sm"
        />
      </div>

      {/* 关联实体 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">关联实体</label>
        <p className="text-xs text-gray-400 mb-2">
          勾选与此攻略相关的已有实体。实体在攻略详情页底部展示。
        </p>
        <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg divide-y divide-gray-100">
          {entities.length === 0 ? (
            <p className="p-3 text-sm text-gray-400">暂无实体数据</p>
          ) : (
            entities.map((entity) => (
              <label
                key={entity.id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.relatedEntities.includes(entity.id)}
                  onChange={() => toggleEntity(entity.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">{entity.name}</span>
                  <span className="ml-2 text-xs text-gray-400">{entity.category}</span>
                </div>
              </label>
            ))
          )}
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <button type="submit" disabled={loading}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? "保存中..." : isEditing ? "更新攻略" : "创建攻略"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">取消</button>
      </div>
    </form>
  );
}
