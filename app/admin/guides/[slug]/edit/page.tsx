import { notFound } from "next/navigation";
import { getGuideBySlug } from "@/lib/guides";
import GuideForm from "@/components/GuideForm";

interface EditPageProps { params: { slug: string } }

export default function EditGuidePage({ params }: EditPageProps) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const initialData = {
    slug: guide.slug,
    title: guide.title,
    description: guide.description,
    category: guide.category,
    tags: guide.tags.join(", "),
    content: guide.content,
    relatedEntities: guide.relatedEntities,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">✏️ 编辑攻略：{guide.title}</h1>
      <GuideForm initialData={initialData} isEditing={true} />
    </div>
  );
}
