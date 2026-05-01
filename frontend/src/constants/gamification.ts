// Qatari donor tier system based on meal count
export type DonorTier = {
  id: string;
  threshold: number;
  emoji: string;
  name_en: string;
  name_ar: string;
  name_fa: string;
  desc_en: string;
  desc_ar: string;
  color: string;
};

export const DONOR_TIERS: DonorTier[] = [
  { id: 'newcomer', threshold: 0, emoji: '🌱', name_en: 'Newcomer', name_ar: 'مبتدئ', name_fa: 'تازه‌وارد', desc_en: 'Just getting started', desc_ar: 'بداية الرحلة', color: '#A8B5A0' },
  { id: 'palm', threshold: 50, emoji: '🌴', name_en: 'Palm Friend', name_ar: 'صديق النخيل', name_fa: 'دوست نخل', desc_en: 'Planted seeds of kindness', desc_ar: 'زرع بذور الخير', color: '#4E7B62' },
  { id: 'pearl', threshold: 200, emoji: '🦪', name_en: 'Pearl Diver', name_ar: 'غواص اللؤلؤ', name_fa: 'غواص مروارید', desc_en: 'Diving deep to help others', desc_ar: 'يغوص عميقاً للمساعدة', color: '#3A8FB7' },
  { id: 'oryx', threshold: 500, emoji: '🦌', name_en: 'Oryx Guardian', name_ar: 'حارس المها', name_fa: 'نگهبان آهو', desc_en: 'Symbol of Qatari pride', desc_ar: 'رمز الفخر القطري', color: '#D4A373' },
  { id: 'falcon', threshold: 1000, emoji: '🦅', name_en: 'Falcon Helper', name_ar: 'الصقر المعين', name_fa: 'یاور شاهین', desc_en: 'Soaring above for the community', desc_ar: 'يحلق فوق المجتمع', color: '#8A1538' },
  { id: 'champion', threshold: 2500, emoji: '🛡️', name_en: 'Qatar Champion', name_ar: 'بطل قطر', name_fa: 'قهرمان قطر', desc_en: 'A true legend of generosity', desc_ar: 'أسطورة في الكرم', color: '#630E26' },
];

export function getTier(meals: number): DonorTier {
  let current = DONOR_TIERS[0];
  for (const t of DONOR_TIERS) {
    if (meals >= t.threshold) current = t;
  }
  return current;
}

export function getNextTier(meals: number): DonorTier | null {
  for (const t of DONOR_TIERS) {
    if (meals < t.threshold) return t;
  }
  return null;
}

// Allergen icon mapping (universal emojis)
export const ALLERGEN_ICONS: Record<string, { emoji: string; en: string; ar: string }> = {
  gluten: { emoji: '🌾', en: 'Gluten', ar: 'غلوتين' },
  dairy: { emoji: '🥛', en: 'Dairy', ar: 'ألبان' },
  nuts: { emoji: '🥜', en: 'Nuts', ar: 'مكسرات' },
  seafood: { emoji: '🦐', en: 'Seafood', ar: 'مأكولات بحرية' },
  eggs: { emoji: '🥚', en: 'Eggs', ar: 'بيض' },
  soy: { emoji: '🫘', en: 'Soy', ar: 'صويا' },
};
