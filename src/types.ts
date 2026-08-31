export type TargetMarketplace = 'Shopee' | 'Tokopedia' | 'TikTok Shop' | 'Lazada';

export type ToneOfVoice = 'Santai & Gaul' | 'Elegan & Premium' | 'Persuasif Promo';

export interface BenefitItem {
  feature: string;
  benefit: string;
}

export interface GeneratedDescription {
  titleOptions: string[];
  hook: string;
  keyBenefits: BenefitItem[];
  packageContents: string[];
  shippingAndNotes: string[];
  hashtags: string[];
  fullFormattedCopy: string;
  marketplace: TargetMarketplace;
  tone: ToneOfVoice;
  productName: string;
  generatedAt?: string;
}

export interface GenerateRequestPayload {
  productName: string;
  specifications: string;
  marketplace: TargetMarketplace;
  tone: ToneOfVoice;
}

export interface PresetSample {
  id: string;
  label: string;
  badge: string;
  productName: string;
  specifications: string;
  marketplace: TargetMarketplace;
  tone: ToneOfVoice;
}
