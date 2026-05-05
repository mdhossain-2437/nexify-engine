export interface Page {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  contentBlocks: ContentBlock[];
  seoTitle: string | null;
  seoDescription: string | null;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export type ContentBlockType =
  | 'hero'
  | 'text'
  | 'image'
  | 'text_image'
  | 'product_grid'
  | 'testimonials'
  | 'cta'
  | 'faq'
  | 'banner'
  | 'custom_html';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  data: Record<string, unknown>;
  order: number;
}
