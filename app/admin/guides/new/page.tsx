import GuideForm from "@/components/GuideForm";

export default function NewGuidePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">➕ 新增攻略</h1>
      <GuideForm isEditing={false} />
    </div>
  );
}
