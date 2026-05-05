export interface TenantSettings {
  id: string;
  tenantId: string;
  siteName: string;
  siteDescription: string | null;
  logo: string | null;
  favicon: string | null;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  socialLinks: Record<string, string>;
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
  seoDefaults: SeoDefaults;
  paymentConfig: PaymentConfig;
}

export interface HeaderConfig {
  layout: 'default' | 'centered' | 'minimal';
  showSearch: boolean;
  showCart: boolean;
  menuItems: MenuItem[];
}

export interface FooterConfig {
  layout: 'default' | 'minimal' | 'expanded';
  columns: FooterColumn[];
  copyrightText: string;
}

export interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface SeoDefaults {
  titleTemplate: string;
  defaultDescription: string;
  ogImage: string | null;
}

export interface PaymentConfig {
  stripeEnabled: boolean;
  stripePublicKey: string | null;
  paypalEnabled: boolean;
  paypalClientId: string | null;
  currency: string;
}
