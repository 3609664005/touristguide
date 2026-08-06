import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import siteConfig from "@/site.config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `TouristGuide.cn · 万宁旅游攻略 — 真实旅行体验与小众目的地指南`,
    template: `%s | TouristGuide.cn`,
  },
  description: "万宁旅游攻略与实地指南，覆盖兴隆美食、本地咖啡、小众景点与特色体验。所有推荐均经实地核验，提供真实可靠的旅行信息。",
  keywords: ["TouristGuide.cn", "旅游攻略", "旅行体验", "小众目的地", "万宁", "实地推荐", "旅行指南"],
  other: {
    'baidu-site-verification': 'codeva-MAU8dgWrwl',
    'sogou_site_verification': '7Bc5Up3T6s',
  },
  alternates: {
    canonical: siteConfig.baseUrl,
  },
  openGraph: {
    title: `TouristGuide.cn · 独立旅游体验攻略平台`,
    description: "万宁实地旅游指南 — 兴隆美食、南洋咖啡、小众景点、冲浪体验，全部经实地核验。",
    type: "website",
    locale: "zh_CN",
    siteName: "TouristGuide.cn",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TouristGuide.cn",
  alternateName: "万宁本地指南",
  url: siteConfig.baseUrl,
  description: "独立旅游体验攻略平台，专注于真实旅行体验、小众目的地与地方特色活动",
  inLanguage: "zh-CN",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.baseUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
