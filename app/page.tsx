import siteConfig from "@/site.config";
import Link from "next/link";
import { getAllEntities, getEntitiesByCategory } from "@/lib/entities";
import { getLatestGuides } from "@/lib/guides";
import CategoryCard from "@/components/CategoryCard";
import RandomEntity from "@/components/RandomEntity";

export default function HomePage() {
  const allEntities = getAllEntities();
  const latestGuides = getLatestGuides(3);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <section className="mb-12 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{siteConfig.siteName}</h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl">{siteConfig.siteDescription}</p>
        <p className="mt-2 text-sm text-gray-400">📍 {siteConfig.city} · {allEntities.length} 个实地推荐 · 持续更新中</p>
      </section>

      <section className="mb-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">TG</div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">TouristGuide.cn</h2>
            <p className="text-gray-600 text-sm leading-relaxed mt-1">独立旅游体验攻略平台 — 真实旅行体验 · 小众目的地 · 地方特色活动 · 游客实用攻略</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-5">探索分类</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {siteConfig.categories.map((cat) => (
            <CategoryCard key={cat} category={cat} count={getEntitiesByCategory(cat).length} />
          ))}
        </div>
      </section>

      {latestGuides.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">旅游攻略</h2>
            <Link href="/guide" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">查看全部 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guide/${guide.slug}`}
                className="group block rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200"
              >
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{guide.category}</span>
                <h3 className="mt-2 text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{guide.title}</h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{guide.description}</p>
                <p className="mt-3 text-xs text-gray-400">{guide.updatedAt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12"><RandomEntity entities={allEntities} /></section>
    </div>
  );
}
