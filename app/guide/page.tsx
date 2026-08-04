import { Metadata } from "next";
import Link from "next/link";
import siteConfig from "@/site.config";
import { getPublishedGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "旅游攻略",
  description: `${siteConfig.city}旅游攻略与路线推荐 — 真实体验、小众路线、在地玩法，由 TouristGuide.cn 整理。`,
};

export default function GuideListPage() {
  const guides = getPublishedGuides();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-gray-700 transition-colors">首页</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">旅游攻略</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">旅游攻略</h1>
      <p className="text-gray-600 mb-8">{siteConfig.city}路线推荐与深度玩法 · 共 {guides.length} 篇</p>

      {guides.length > 0 ? (
        <div className="space-y-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guide/${guide.slug}`}
              className="block rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{guide.category}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{guide.title}</h2>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{guide.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {guide.tags.map((tag) => (
                      <span key={tag} className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-400">更新于 {guide.updatedAt}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">暂无攻略，敬请期待</div>
      )}
    </div>
  );
}
