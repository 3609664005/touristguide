import guides from "@/data/guides.json";

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  content: string;
  relatedEntities: string[];
}

const typedGuides = guides as unknown as Guide[];

export function getAllGuides(): Guide[] {
  return typedGuides;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return typedGuides.find((g) => g.slug === slug);
}

export function getAllGuideSlugs(): string[] {
  return typedGuides.map((g) => g.slug);
}

export function getLatestGuides(count: number): Guide[] {
  return [...typedGuides]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}
