export const QATAR_LOCATIONS = [
  { id: 'doha', en: 'Doha', ar: 'الدوحة' },
  { id: 'alrayyan', en: 'Al Rayyan', ar: 'الريان' },
  { id: 'lusail', en: 'Lusail', ar: 'لوسيل' },
  { id: 'pearl', en: 'The Pearl', ar: 'اللؤلؤة' },
  { id: 'educity', en: 'Education City', ar: 'المدينة التعليمية' },
  { id: 'souq', en: 'Souq Waqif', ar: 'سوق واقف' },
  { id: 'alwakrah', en: 'Al Wakrah', ar: 'الوكرة' },
  { id: 'alkhor', en: 'Al Khor', ar: 'الخور' },
  { id: 'westbay', en: 'West Bay', ar: 'الخليج الغربي' },
];

export type DeliveryTask = {
  id: string;
  title_en: string;
  title_ar: string;
  from: string;
  to: string;
  toNgo_en: string;
  toNgo_ar: string;
  meals: number;
  distanceKm: number;
  status: 'open' | 'accepted' | 'pickup' | 'onway' | 'delivered';
  vehicle: 'van' | 'refrigeratedVan' | 'truck';
  scheduledIn: string;
};

export const MOCK_TASKS: DeliveryTask[] = [
  {
    id: 't1',
    title_en: 'Hotel buffet surplus',
    title_ar: 'فائض بوفيه فندق',
    from: 'westbay',
    to: 'doha',
    toNgo_en: 'Qatar Charity',
    toNgo_ar: 'قطر الخيرية',
    meals: 120,
    distanceKm: 3.2,
    status: 'open',
    vehicle: 'refrigeratedVan',
    scheduledIn: '45 min',
  },
  {
    id: 't2',
    title_en: 'Wedding leftovers',
    title_ar: 'بقايا عرس',
    from: 'lusail',
    to: 'alrayyan',
    toNgo_en: 'Eid Charity',
    toNgo_ar: 'جمعية عيد الخيرية',
    meals: 350,
    distanceKm: 8.7,
    status: 'open',
    vehicle: 'truck',
    scheduledIn: '1 hr',
  },
  {
    id: 't3',
    title_en: 'Home-cooked meals',
    title_ar: 'وجبات منزلية',
    from: 'pearl',
    to: 'doha',
    toNgo_en: 'RAF Qatar',
    toNgo_ar: 'راف قطر',
    meals: 8,
    distanceKm: 2.1,
    status: 'open',
    vehicle: 'van',
    scheduledIn: '20 min',
  },
  {
    id: 't4',
    title_en: 'Restaurant surplus',
    title_ar: 'فائض مطعم',
    from: 'souq',
    to: 'alwakrah',
    toNgo_en: 'Fanar',
    toNgo_ar: 'فنار',
    meals: 40,
    distanceKm: 16.4,
    status: 'open',
    vehicle: 'van',
    scheduledIn: '30 min',
  },
];

export const MOCK_NGOS = [
  { id: 'qc', en: 'Qatar Charity', ar: 'قطر الخيرية', area: 'Doha' },
  { id: 'eid', en: 'Eid Charity', ar: 'جمعية عيد الخيرية', area: 'Al Rayyan' },
  { id: 'raf', en: 'RAF Qatar', ar: 'راف قطر', area: 'Lusail' },
  { id: 'fanar', en: 'Fanar', ar: 'فنار', area: 'Doha' },
];

export const MOCK_IMPACT = {
  mealsRescued: 184620,
  wasteReducedKg: 42380,
  activeVolunteers: 312,
  completedDeliveries: 8741,
  areasServed: 9,
  weeklyTrend: [320, 450, 380, 610, 540, 720, 820],
};

export const MOCK_RECENT = [
  {
    id: 'r1',
    en: 'Volunteer Ali delivered 40 meals to Fanar',
    ar: 'المتطوع علي سلّم 40 وجبة لفنار',
    time: '2h',
  },
  {
    id: 'r2',
    en: 'Hotel donation matched with Qatar Charity',
    ar: 'تبرع فندق تم ربطه بقطر الخيرية',
    time: '5h',
  },
  {
    id: 'r3',
    en: '350 wedding meals rescued in Lusail',
    ar: 'إنقاذ 350 وجبة عرس في لوسيل',
    time: '1d',
  },
];

export function suggestVehicle(meals: number): 'van' | 'refrigeratedVan' | 'truck' {
  if (meals < 50) return 'van';
  if (meals < 200) return 'refrigeratedVan';
  return 'truck';
}

export function computeSafety(hoursAgo: number, storage: 'hot' | 'cold' | 'room'): {
  level: 'safe' | 'caution' | 'risky';
  windowMinutes: number;
} {
  if (storage === 'cold') {
    if (hoursAgo <= 4) return { level: 'safe', windowMinutes: 180 };
    if (hoursAgo <= 8) return { level: 'caution', windowMinutes: 90 };
    return { level: 'risky', windowMinutes: 0 };
  }
  if (storage === 'hot') {
    if (hoursAgo <= 2) return { level: 'safe', windowMinutes: 120 };
    if (hoursAgo <= 4) return { level: 'caution', windowMinutes: 60 };
    return { level: 'risky', windowMinutes: 0 };
  }
  // room temperature
  if (hoursAgo <= 1) return { level: 'safe', windowMinutes: 60 };
  if (hoursAgo <= 2) return { level: 'caution', windowMinutes: 30 };
  return { level: 'risky', windowMinutes: 0 };
}
