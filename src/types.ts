export type ScreenId =
  | 'guest-home'
  | 'fit-quiz'
  | 'product-detail'
  | 'checkout'
  | 'otp-pickup';

export type DeliveryMethod = 'locker' | 'courier';
export type EWalletType = 'Momo' | 'ZaloPay' | 'VietQR';

export interface ProductReview {
  id: string;
  author: string;
  district: string;
  rating: number;
  comment: string;
  verifiedDate: string;
}

export type ProductCategory =
  | 'condom'
  | 'contraceptive'
  | 'enhancement'
  | 'lubricant';

export interface Product {
  id: string;
  name: string;
  shortName: string;
  packSize: string;
  priceVnd: number;
  pharmacyPartner: string;
  district: string;
  mohLicenseNo: string;
  batchNo: string;
  expiryDate: string;
  category: ProductCategory;
  nominalWidth: string;
  shortWidth: string;
  thickness: string;
  shortThickness: string;
  material: string;
  shortMaterial: string;
  shortExpiry: string;
  lubricant: string;
  highlightBadge: string;
  keyIngredients: string[];
  summary: string;
  usageGuide: string;
  safetyWarning: string;
  fitTags: string[];
  accentTone: 'teal' | 'sage' | 'slate' | 'coral';
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type QuizGoal = 'condom' | 'contraceptive' | 'enhancement';

export interface QuizAnswers {
  goal: QuizGoal | '';
  preference: string;
  budget: string;
}

export interface QuizMatchResult {
  product: Product;
  matchLabel: string;
  reasons: string[];
  timingNote?: string;
}

export interface QuizState {
  phase: 'questions' | 'results';
  stepIndex: number;
  answers: QuizAnswers;
  results: QuizMatchResult[];
}

export interface SituationGuide {
  id: string;
  tag: string;
  title: string;
  bullets: [string, string, string];
  recommendedProductId: string;
  reasonBadge: string;
}

export type DistrictFilter =
  | 'ALL'
  | 'Q.1'
  | 'Q.3'
  | 'Q.7'
  | 'Q.10'
  | 'Bình Thạnh'
  | 'Gò Vấp'
  | 'Tân Bình'
  | 'Thủ Đức';

export interface SmartLockerLocation {
  id: string;
  lockerCode: string;
  name: string;
  district: string;
  districtShort: Exclude<DistrictFilter, 'ALL'>;
  addressHint: string;
  openHours: string;
  availableSlots: number;
  lat: number;
  lng: number;
  /** Percentage coordinates (0-100) on the HCMC Zine SVG map canvas */
  mapX: number;
  mapY: number;
}

export type OrderStatus = 'ready' | 'COMPLETED';

export interface OrderReviewSnapshot {
  rating: number;
  tags: string[];
  comment: string;
  submittedAtLabel: string;
  targetProductId?: string;
  targetProductLabel?: string;
}

export interface OrderSnapshot {
  id: string;
  orderCode: string;
  otpDigits: string;
  deliveryMethod: DeliveryMethod;
  lockerLocation: SmartLockerLocation;
  courierAddressHint: string;
  eWallet: EWalletType;
  totalVnd: number;
  readyEstimate: string;
  itemCount: number;
  itemsSummary: string;
  productIds?: string[];
  createdAtLabel: string;
  completedAtLabel?: string;
  status: OrderStatus | 'picked_up';
  reviewSubmitted?: OrderReviewSnapshot;
}
