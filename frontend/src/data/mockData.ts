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
  co2AvoidedKg: 105950,
  waterSavedLiters: 3420000,
  avgResponseMinutes: 28,
  weeklyTrend: [320, 450, 380, 610, 540, 720, 820],
  monthlyTrend: [12400, 15800, 14200, 16900, 18700, 21200, 19800, 22400, 24100, 23500, 26800, 28200],
  topAreas: [
    { id: 'doha', en: 'Doha', ar: 'الدوحة', meals: 62800, share: 34 },
    { id: 'alrayyan', en: 'Al Rayyan', ar: 'الريان', meals: 38900, share: 21 },
    { id: 'lusail', en: 'Lusail', ar: 'لوسيل', meals: 27600, share: 15 },
    { id: 'pearl', en: 'The Pearl', ar: 'اللؤلؤة', meals: 18500, share: 10 },
    { id: 'alwakrah', en: 'Al Wakrah', ar: 'الوكرة', meals: 14200, share: 8 },
  ],
  topNgos: [
    { id: 'qc', en: 'Qatar Charity', ar: 'قطر الخيرية', meals: 58400 },
    { id: 'eid', en: 'Eid Charity', ar: 'جمعية عيد الخيرية', meals: 41200 },
    { id: 'raf', en: 'RAF Qatar', ar: 'راف قطر', meals: 32800 },
    { id: 'fanar', en: 'Fanar', ar: 'فنار', meals: 19600 },
  ],
  foodCategories: [
    { en: 'Cooked Meals', ar: 'وجبات مطبوخة', share: 48, color: '#8A1538' },
    { en: 'Bakery', ar: 'مخبوزات', share: 18, color: '#A62148' },
    { en: 'Fresh Produce', ar: 'خضار وفواكه', share: 15, color: '#4E7B62' },
    { en: 'Dairy', ar: 'ألبان', share: 11, color: '#679B7F' },
    { en: 'Other', ar: 'أخرى', share: 8, color: '#D4A373' },
  ],
  peakHours: [
    { hour: '8AM', value: 18 },
    { hour: '10AM', value: 22 },
    { hour: '12PM', value: 35 },
    { hour: '2PM', value: 28 },
    { hour: '4PM', value: 24 },
    { hour: '6PM', value: 38 },
    { hour: '8PM', value: 52 },
    { hour: '10PM', value: 31 },
  ],
};

export const MOCK_LEADERBOARD = [
  { id: 'l1', name: 'Fatima Al-Thani', meals: 1240, avatar: 'F' },
  { id: 'l2', name: 'Mohammed Hassan', meals: 980, avatar: 'M' },
  { id: 'l3', name: 'Sara Al-Kuwari', meals: 870, avatar: 'S' },
  { id: 'l4', name: 'Ahmed Al-Mahmoud', meals: 642, avatar: 'A', isMe: true },
  { id: 'l5', name: 'Layla Ibrahim', meals: 510, avatar: 'L' },
  { id: 'l6', name: 'Omar Abdullah', meals: 380, avatar: 'O' },
];

export const MY_RANK = 4;
export const MY_TOTAL_MEALS = 642;

export const MOCK_NEARBY_RESTAURANTS = [
  { id: 'r1', name_en: 'Doha Bakery', name_ar: 'مخبز الدوحة', cuisine_en: 'Bakery & Pastries', cuisine_ar: 'مخبوزات وحلويات', area_en: 'Doha', area_ar: 'الدوحة', distanceKm: 0.8, mealsAvailable: 12, openNow: true, allowsBYO: true, allowsPickup: true, allowsDelivery: true, x: 35, y: 45 },
  { id: 'r2', name_en: 'Lusail Grill House', name_ar: 'مطعم لوسيل للمشاوي', cuisine_en: 'Grills & Mixed', cuisine_ar: 'مشاوي ومتنوع', area_en: 'Lusail', area_ar: 'لوسيل', distanceKm: 2.3, mealsAvailable: 28, openNow: true, allowsBYO: false, allowsPickup: true, allowsDelivery: true, x: 55, y: 25 },
  { id: 'r3', name_en: 'Pearl Cafe', name_ar: 'مقهى اللؤلؤة', cuisine_en: 'Cafe & Sandwiches', cuisine_ar: 'مقهى وسندويشات', area_en: 'The Pearl', area_ar: 'اللؤلؤة', distanceKm: 3.7, mealsAvailable: 8, openNow: true, allowsBYO: true, allowsPickup: true, allowsDelivery: false, x: 70, y: 55 },
  { id: 'r4', name_en: 'Souq Family Kitchen', name_ar: 'مطبخ سوق العائلة', cuisine_en: 'Traditional Qatari', cuisine_ar: 'مأكولات قطرية', area_en: 'Souq Waqif', area_ar: 'سوق واقف', distanceKm: 4.2, mealsAvailable: 18, openNow: true, allowsBYO: true, allowsPickup: true, allowsDelivery: true, x: 25, y: 65 },
  { id: 'r5', name_en: 'Al Wakrah Eats', name_ar: 'مأكولات الوكرة', cuisine_en: 'Mixed Cuisine', cuisine_ar: 'مأكولات متنوعة', area_en: 'Al Wakrah', area_ar: 'الوكرة', distanceKm: 5.6, mealsAvailable: 22, openNow: false, allowsBYO: true, allowsPickup: true, allowsDelivery: true, x: 50, y: 80 },
];

export const VOLUNTEER_STATS = {
  tasksToday: 2,
  kmCovered: 12.5,
  totalDeliveries: 47,
  rating: 4.9,
};

export const MOCK_MY_DONATIONS = [
  { id: 'd1', title_en: 'Iftar leftovers', title_ar: 'بقايا إفطار', meals: 22, status: 'delivered', date: 'Yesterday' },
  { id: 'd2', title_en: 'Office lunch surplus', title_ar: 'فائض غداء مكتب', meals: 14, status: 'in_transit', date: 'Today' },
  { id: 'd3', title_en: 'Family gathering', title_ar: 'تجمع عائلي', meals: 8, status: 'delivered', date: '3 days ago' },
];

export const MOCK_MY_REQUESTS = [
  { id: 'q1', familySize: 4, urgency: 'high', area_en: 'Al Wakrah', area_ar: 'الوكرة', status: 'matched', match_en: 'RAF Qatar', match_ar: 'راف قطر', date: 'Today' },
  { id: 'q2', familySize: 4, urgency: 'mid', area_en: 'Al Wakrah', area_ar: 'الوكرة', status: 'fulfilled', match_en: 'Qatar Charity', match_ar: 'قطر الخيرية', date: 'Last week' },
];

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
    if (hoursAgo <= 3) return { level: 'safe', windowMinutes: 180 };
    if (hoursAgo <= 6) return { level: 'caution', windowMinutes: 90 };
    return { level: 'risky', windowMinutes: 0 };
  }
  if (storage === 'hot') {
    if (hoursAgo <= 2) return { level: 'safe', windowMinutes: 120 };
    if (hoursAgo <= 3) return { level: 'caution', windowMinutes: 60 };
    return { level: 'risky', windowMinutes: 0 };
  }
  // room temperature
  if (hoursAgo <= 1) return { level: 'safe', windowMinutes: 60 };
  if (hoursAgo <= 2) return { level: 'caution', windowMinutes: 30 };
  return { level: 'risky', windowMinutes: 0 };
}
