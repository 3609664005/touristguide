"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface GuideRow {
  slug: string;
  title: string;
  description: string;
  category: string;
  updatedAt: string;
  status?: string;
}

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<GuideRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/admin/api/guides", {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin-token")}` },
    })
      .then((r) => r.json())
      .then((data) => setGuides(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (slug: string, newStatus: "published" | "hidden") => {
    const token = localStorage.getItem("admin-token");
    const res = await fetch("/admin/api/guides", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ slug, status: newStatus }),
    });
    if (res.ok) {
      setGuides((prev) =>
        prev.map((g) => (g.slug === slug ? { ...g, status: newStatus } : g))
      );
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "操作失败");
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-500">加载中...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📝 攻略管理</h1>
        <Link href="/admin/guides/new" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
          + 新增攻略
        </Link>
      </div>

      {guides.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">标题</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">简介</th>
                <th className="text-left px-4 py-3 font-medium">分类</th>
                <th className="text-left px-4 py-3 font-medium">状态</th>
                <th className="text-left px-4 py-3 font-medium">更新时间</th>
                <th className="text-left px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((guide) => {
                const isHidden = guide.status === "hidden";
                return (
                  <tr key={guide.slug} className={`border-t border-gray-100 hover:bg-gray-50 ${isHidden ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[160px] truncate">{guide.title}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell max-w-[200px] truncate">{guide.description}</td>
                    <td className="px-4 py-3 text-gray-600">{guide.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isHidden ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">已隐藏</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">已发布</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{guide.updatedAt}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {!isHidden && (
                        <Link href={`/guide/${guide.slug}`} target="_blank" className="text-blue-600 hover:text-blue-800 text-sm">
                          查看
                        </Link>
                      )}
                      <Link href={`/admin/guides/${guide.slug}/edit`} className="ml-3 text-green-600 hover:text-green-800 text-sm">
                        编辑
                      </Link>
                      {isHidden ? (
                        <button
                          onClick={() => toggleStatus(guide.slug, "published")}
                          className="ml-3 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          恢复发布
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleStatus(guide.slug, "hidden")}
                          className="ml-3 text-orange-600 hover:text-orange-800 text-sm"
                        >
                          隐藏
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
          暂无攻略
        </div>
      )}
    </div>
  );
}
