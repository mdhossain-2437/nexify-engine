export interface Product {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  sku: string | null;
  status: ProductStatus;
  categoryId: string | null;
  images: string[];
  variants: ProductVariant[];
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus = 'draft' | 'published' | 'archived';

export interface ProductVariant {
  id: string;
  productId: string;
  tenantId: string;
  name: string;
  color: string | null;
  size: string | null;
  priceModifier: number;
  stock: number;
  sku: string | null;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string | null;
  image: string | null;
}
