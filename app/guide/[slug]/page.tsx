import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import siteConfig from "@/site.config";
import { getGuideBySlug, getAllGuideSlugs } from "@/lib/guides";
import { getEntityBySlug } from "@/lib/entities";
import EntityCard from "@/components/EntityCard";

interface GuideDetailProps { params: { slug: string } }

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: GuideDetailProps): Metadata {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return { title: "未找到" };
  return {
    title: guide.title,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
    },
  };
}

function renderMarkdown(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-900 mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-200">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-4">$1</h1>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-700 leading-relaxed">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="list-disc space-y-1 my-3">$&</ul>')
    .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-4">')
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith('<')) return match;
      return match;
    });
}

export default function GuideDetailPage({ params }: GuideDetailProps) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const relatedEntities = guide.relatedEntities
    .map((slug) => getEntityBySlug(slug))
    .filter(Boolean);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-gray-700 transition-colors">首页</a>
          <span className="mx-2">/</span>
          <a href="/guide" className="hover:text-gray-700 transition-colors">旅游攻略</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate">{guide.title}</span>
        </nav>

        <div className="mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{guide.category}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{guide.title}</h1>
        <p className="text-sm text-gray-500 mb-8">更新于 {guide.updatedAt}</p>

        <article className="prose prose-gray max-w-none">
          <div className="text-gray-700 leading-relaxed space-y-3" dangerouslySetInnerHTML={{ __html: `<p class="text-gray-700 leading-relaxed mb-4">${renderMarkdown(guide.content)}</p>` }} />
        </article>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {guide.tags.map((tag) => (
            <span key={tag} className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{tag}</span>
          ))}
        </div>

        {relatedEntities.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">攻略中提到的地点</h2>
            <p className="text-sm text-gray-500 mb-6">以下实体信息由 {siteConfig.siteName} 采集并核验</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEntities.map((entity) => (
                <EntityCard key={entity!.id} entity={entity!} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
