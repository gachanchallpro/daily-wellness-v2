import {
  CartItem,
  DeliveryMethod,
  DistrictFilter,
  OrderSnapshot,
  Product,
  ProductReview,
  QuizState,
  SmartLockerLocation,
} from '../types';

export type ShelfFilter =
  | 'all'
  | 'condom'
  | 'contraceptive'
  | 'enhancement'
  | 'lubricant';

const SIZE_ORDER: Record<string, number> = {
  '49mm': 1,
  '52mm': 2,
  '52.5mm': 3,
  '55mm': 4,
  '56mm': 5,
};

export function filterProductsByShelf(
  products: Product[],
  shelfFilter: ShelfFilter
): Product[] {
  if (shelfFilter === 'condom') {
    return products
      .filter((p) => p.category === 'condom')
      .sort(
        (a, b) => (SIZE_ORDER[a.shortWidth] ?? 9) - (SIZE_ORDER[b.shortWidth] ?? 9)
      );
  }
  if (shelfFilter === 'contraceptive') {
    return products.filter((p) => p.category === 'contraceptive');
  }
  if (shelfFilter === 'enhancement') {
    return products.filter((p) => p.category === 'enhancement');
  }
  if (shelfFilter === 'lubricant') {
    return products.filter((p) => p.category === 'lubricant');
  }
  return products;
}

export function calculateCheckoutSummary(
  cart: CartItem[],
  deliveryMethod: DeliveryMethod
): {
  totalQty: number;
  subtotalVnd: number;
  deliveryFeeVnd: number;
  totalVnd: number;
} {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalVnd = cart.reduce(
    (sum, item) => sum + item.product.priceVnd * item.quantity,
    0
  );
  const deliveryFeeVnd =
    cart.length === 0 ? 0 : deliveryMethod === 'locker' ? 0 : 18000;
  return {
    totalQty,
    subtotalVnd,
    deliveryFeeVnd,
    totalVnd: subtotalVnd + deliveryFeeVnd,
  };
}

export function canConfirmCheckout(params: {
  deliveryMethod: DeliveryMethod;
  selectedLocker: SmartLockerLocation | null;
  courierHint: string;
}): boolean {
  if (params.deliveryMethod === 'locker') {
    return Boolean(params.selectedLocker);
  }
  return params.courierHint.trim().length > 0;
}

export function filterLockersByDistrict(
  lockers: SmartLockerLocation[],
  districtFilter: DistrictFilter
): SmartLockerLocation[] {
  if (districtFilter === 'ALL') return lockers;
  return lockers.filter((loc) => loc.districtShort === districtFilter);
}

export function formatLockerCompactTitle(
  locker: Pick<SmartLockerLocation, 'name' | 'districtShort'>
): string {
  const cleanName = locker.name
    .replace(/^Tủ\s+/i, '')
    .replace(/\s*\([^)]+\)\s*$/, '')
    .trim();
  const districtLabel =
    locker.districtShort === 'Thủ Đức'
      ? 'TP. Thủ Đức'
      : locker.districtShort.startsWith('Q.')
      ? locker.districtShort
      : `Q. ${locker.districtShort}`;
  return `${cleanName} · ${districtLabel}`;
}

export function formatStep2DeliverySummary(params: {
  deliveryMethod: DeliveryMethod;
  selectedLocker: SmartLockerLocation | null;
  districtFilter: DistrictFilter;
  courierHint: string;
}): string {
  if (params.deliveryMethod === 'locker') {
    return params.selectedLocker
      ? formatLockerCompactTitle(params.selectedLocker)
      : 'Tủ Smart Locker 24/7';
  }
  if (params.districtFilter !== 'ALL') {
    return `Giao thả 30p · ${params.districtFilter}`;
  }
  const trimmedHint = params.courierHint.trim();
  return trimmedHint ? `Giao thả 30p · ${trimmedHint}` : 'Giao thả 30p';
}

export function deleteSingleOrder(
  orders: OrderSnapshot[],
  orderId: string
): OrderSnapshot[] {
  return orders.filter((order) => order.id !== orderId);
}

export function countOtherPendingOrders(
  orders: OrderSnapshot[],
  currentOrderId: string
): number {
  return orders.filter(
    (order) => order.id !== currentOrderId && !isOrderCompleted(order)
  ).length;
}

export function createInitialQuizState(): QuizState {
  return {
    phase: 'questions',
    stepIndex: 0,
    answers: {
      goal: '',
      preference: '',
      budget: '',
    },
    results: [],
  };
}

export function shouldTriggerPanicShortcut(params: {
  key: string;
  repeat?: boolean;
  panicDecoyActive: boolean;
}): boolean {
  if (params.panicDecoyActive) return false;
  if (params.repeat) return false;
  return params.key === 'Escape' || params.key === 'Esc';
}

export const MIN_CART_QTY = 1;
export const MAX_CART_QTY = 99;

export function clampQuantity(
  qty: number,
  min: number = MIN_CART_QTY,
  max: number = MAX_CART_QTY
): number {
  if (!Number.isFinite(qty)) return min;
  const rounded = Math.trunc(qty);
  if (rounded < min) return min;
  if (rounded > max) return max;
  return rounded;
}

export function parseQuantityInput(
  rawValue: string,
  min: number = MIN_CART_QTY,
  max: number = MAX_CART_QTY
): number {
  const trimmed = rawValue.trim();
  if (!trimmed) return min;
  const parsed = Number.parseInt(trimmed, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return min;
  return clampQuantity(parsed, min, max);
}

export const ANONYMOUS_REVIEW_TAGS: ReadonlyArray<string> = [
  'Đóng gói siêu kín',
  'Lấy tủ OTP mượt',
  'Đúng mô tả',
  'Giao đúng hẹn',
];

export function isOrderCompleted(
  order: Pick<OrderSnapshot, 'status'> | null | undefined
): boolean {
  if (!order) return false;
  return order.status === 'COMPLETED' || order.status === 'picked_up';
}

export function markOrderCompleted(
  orders: OrderSnapshot[],
  orderId: string,
  completedAtLabel: string
): OrderSnapshot[] {
  return orders.map((order) => {
    if (order.id !== orderId) return order;
    if (isOrderCompleted(order)) {
      return order.status === 'COMPLETED'
        ? order
        : { ...order, status: 'COMPLETED' };
    }
    return {
      ...order,
      status: 'COMPLETED',
      completedAtLabel,
    };
  });
}

export function buildAnonymousReviewComment(
  tags: string[],
  comment: string
): string {
  const cleanComment = comment.trim();
  const cleanTags = tags.map((t) => t.trim()).filter(Boolean);
  if (cleanTags.length > 0 && cleanComment) {
    return `${cleanTags.join(' · ')} — ${cleanComment}`;
  }
  if (cleanComment) {
    return cleanComment;
  }
  if (cleanTags.length > 0) {
    return cleanTags.join(' · ');
  }
  return 'Trải nghiệm kín đáo, hài lòng.';
}

export const ORDER_GENERAL_REVIEW_TARGET = 'ORDER_GENERAL';

export interface OrderReviewTargetOption {
  id: string;
  label: string;
}

export function getOrderReviewTargets(
  order: Pick<OrderSnapshot, 'productIds'>,
  products: Product[]
): OrderReviewTargetOption[] {
  const uniqueIds = Array.from(new Set(order.productIds ?? []));
  return uniqueIds.map((id) => {
    const matched = products.find((p) => p.id === id);
    return {
      id,
      label: matched ? matched.shortName : id,
    };
  });
}

export function submitOrderAnonymousReview(params: {
  orders: OrderSnapshot[];
  orderId: string;
  sessionReviewsByProductId: Record<string, ProductReview[]>;
  rating: number;
  tags: string[];
  comment: string;
  submittedAtLabel: string;
  targetProductId?: string;
  targetProductLabel?: string;
}): {
  orders: OrderSnapshot[];
  sessionReviewsByProductId: Record<string, ProductReview[]>;
  didSubmit: boolean;
} {
  const targetOrder = params.orders.find((o) => o.id === params.orderId);
  if (!targetOrder || !isOrderCompleted(targetOrder)) {
    return {
      orders: params.orders,
      sessionReviewsByProductId: params.sessionReviewsByProductId,
      didSubmit: false,
    };
  }
  if (targetOrder.reviewSubmitted) {
    return {
      orders: params.orders,
      sessionReviewsByProductId: params.sessionReviewsByProductId,
      didSubmit: false,
    };
  }

  const safeRating = Math.min(5, Math.max(1, Math.trunc(params.rating)));
  if (!Number.isFinite(params.rating) || params.rating < 1) {
    return {
      orders: params.orders,
      sessionReviewsByProductId: params.sessionReviewsByProductId,
      didSubmit: false,
    };
  }

  const cleanTags = Array.from(
    new Set(params.tags.map((t) => t.trim()).filter(Boolean))
  );
  const cleanComment = params.comment.trim();
  const composedComment = buildAnonymousReviewComment(cleanTags, cleanComment);
  const district =
    targetOrder.deliveryMethod === 'locker'
      ? targetOrder.lockerLocation.districtShort
      : 'TP.HCM';

  const productIds =
    targetOrder.productIds && targetOrder.productIds.length > 0
      ? Array.from(new Set(targetOrder.productIds))
      : [];

  const nextReviewsMap: Record<string, ProductReview[]> = {
    ...params.sessionReviewsByProductId,
  };

  let resolvedTargetId = ORDER_GENERAL_REVIEW_TARGET;
  let resolvedTargetLabel = 'Đánh giá chung cho đơn hàng';

  if (productIds.length === 1) {
    if (params.targetProductId !== ORDER_GENERAL_REVIEW_TARGET) {
      resolvedTargetId = productIds[0];
      resolvedTargetLabel = params.targetProductLabel ?? productIds[0];
    }
  } else if (
    productIds.length > 1 &&
    params.targetProductId &&
    params.targetProductId !== ORDER_GENERAL_REVIEW_TARGET &&
    productIds.includes(params.targetProductId)
  ) {
    resolvedTargetId = params.targetProductId;
    resolvedTargetLabel =
      params.targetProductLabel ?? params.targetProductId;
  }

  if (
    resolvedTargetId !== ORDER_GENERAL_REVIEW_TARGET &&
    productIds.includes(resolvedTargetId)
  ) {
    const existing = nextReviewsMap[resolvedTargetId] ?? [];
    const newReview: ProductReview = {
      id: `rev-${targetOrder.id}-${resolvedTargetId}`,
      author: 'Khách ẩn danh',
      district,
      rating: safeRating,
      comment: composedComment,
      verifiedDate: 'Vừa xong',
    };
    nextReviewsMap[resolvedTargetId] = [newReview, ...existing];
  }

  const nextOrders = params.orders.map((order) =>
    order.id === targetOrder.id
      ? {
          ...order,
          reviewSubmitted: {
            rating: safeRating,
            tags: cleanTags,
            comment: cleanComment,
            submittedAtLabel: params.submittedAtLabel,
            targetProductId: resolvedTargetId,
            targetProductLabel: resolvedTargetLabel,
          },
        }
      : order
  );

  return {
    orders: nextOrders,
    sessionReviewsByProductId: nextReviewsMap,
    didSubmit: true,
  };
}

export function getMergedProductReviews(
  product: Product,
  sessionReviewsByProductId: Record<string, ProductReview[]>
): ProductReview[] {
  const sessionList = sessionReviewsByProductId[product.id] ?? [];
  if (sessionList.length === 0) return product.reviews;
  return [...sessionList, ...product.reviews];
}
