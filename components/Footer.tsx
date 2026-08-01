import siteConfig from "@/site.config";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {siteConfig.siteName} · 所有推荐均经实地核验
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            TouristGuide.cn 是独立旅游信息整理平台，与 tourguide.cn 等其他网站不存在关联。内容仅供参考，不构成官方认证。
          </p>
        </div>
      </div>
    </footer>
  );
}
