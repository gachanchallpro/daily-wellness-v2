import {
  CartItem,
  DeliveryMethod,
  DistrictFilter,
  EWalletType,
  OrderSnapshot,
  Product,
  ScreenId,
  SmartLockerLocation,
} from '../types';
import {
  DEFAULT_COURIER_HINT,
  PRODUCTS,
  SMART_LOCKER_LOCATIONS,
} from '../data/mockData';

export interface TutorialStepSpec {
  id: string;
  screen: ScreenId;
  target: string;
  title: string;
  description: string;
  cutoutRadius: number;
  allowTargetClick: boolean;
}

export const TUTORIAL_STEPS: readonly TutorialStepSpec[] = [
  {
    id: 'step-1-product',
    screen: 'guest-home',
    target: 'first-product-card',
    title: '1. Chọn món & xem lô',
    description: 'Chạm thẻ xem size, số lô và chuẩn Bộ Y Tế.',
    cutoutRadius: 16,
    allowTargetClick: true,
  },
  {
    id: 'step-2-quick-add',
    screen: 'guest-home',
    target: 'first-product-qty',
    title: '2. Thêm nhanh vào giỏ',
    description: 'Bấm + hoặc chạm số để thêm nhanh vào giỏ.',
    cutoutRadius: 12,
    allowTargetClick: true,
  },
  {
    id: 'step-3-locker',
    screen: 'checkout',
    target: 'checkout-locker-list',
    title: '3. Chọn tủ nhận 24/7',
    description: 'Xem tủ đang chọn hoặc bấm Đổi tủ gần bạn.',
    cutoutRadius: 14,
    allowTargetClick: true,
  },
  {
    id: 'step-4-discreet-label',
    screen: 'checkout',
    target: 'label-compare-slider',
    title: '4. Kiểm tra bọc kín',
    description: 'Bấm Xem thử hộp để đối chiếu tem 0 tên shop.',
    cutoutRadius: 14,
    allowTargetClick: true,
  },
  {
    id: 'step-5-otp',
    screen: 'otp-pickup',
    target: 'otp-pickup-box',
    title: '5. Lấy mã mở tủ',
    description: 'Dùng OTP 6 số mở tủ, rồi bấm Đã nhận hàng.',
    cutoutRadius: 16,
    allowTargetClick: true,
  },
  {
    id: 'step-6-panic',
    screen: 'otp-pickup',
    target: 'panic-hide-btn',
    title: '6. Ngụy trang 1 chạm',
    description: 'Bấm ẨN NHANH hoặc phím ESC để ngụy trang tức thì.',
    cutoutRadius: 12,
    allowTargetClick: true,
  },
];

export const TUTORIAL_STEP_COUNT = TUTORIAL_STEPS.length;

export interface TutorialSessionSnapshot {
  screen: ScreenId;
  returnScreen: ScreenId;
  selectedProduct: Product;
  cart: CartItem[];
  orders: OrderSnapshot[];
  activeOrderId: string | null;
  deliveryMethod: DeliveryMethod;
  selectedLocker: SmartLockerLocation | null;
  districtFilter: DistrictFilter;
  eWallet: EWalletType;
  courierHint: string;
  panicDecoyActive: boolean;
}

export const TUTORIAL_SANDBOX_ORDER_ID = 'ord-tutorial-sandbox';

export function createTutorialSandboxCart(): CartItem[] {
  return [
    {
      product: PRODUCTS[0],
      quantity: 1,
    },
  ];
}

export function createTutorialSandboxOrder(
  locker: SmartLockerLocation = SMART_LOCKER_LOCATIONS[0],
  wallet: EWalletType = 'Momo'
): OrderSnapshot {
  const sampleProduct = PRODUCTS[0];
  return {
    id: TUTORIAL_SANDBOX_ORDER_ID,
    orderCode: 'DW-8899',
    otpDigits: '628 - 419',
    deliveryMethod: 'locker',
    lockerLocation: locker,
    courierAddressHint: DEFAULT_COURIER_HINT,
    eWallet: wallet,
    totalVnd: sampleProduct.priceVnd,
    readyEstimate: 'Sẵn sàng sau 20 phút',
    itemCount: 1,
    itemsSummary: `${sampleProduct.shortName} ×1`,
    productIds: [sampleProduct.id],
    createdAtLabel: 'Demo',
    status: 'ready',
  };
}

export interface RectBox {
  left: number;
  top: number;
  width: number;
  height: number;
  containerW: number;
  containerH: number;
}

export interface ComputedTooltipLayout {
  tooltipLeft: number;
  tooltipTop: number;
  tooltipWidth: number;
  placement: 'above' | 'below' | 'left' | 'right';
  targetCenterX: number;
  targetCenterY: number;
  arrowStartX: number;
  arrowStartY: number;
  arrowEndX: number;
  arrowEndY: number;
  arrowPathD: string;
  showArrow: boolean;
}

export function computeTutorialOverlayLayout(
  cutout: RectBox,
  tooltipEstimatedHeight = 200
): ComputedTooltipLayout {
  const edgeMargin = 12;
  const gap = 32;
  const tooltipWidth = Math.max(
    240,
    Math.min(340, cutout.containerW - edgeMargin * 2)
  );

  const targetCenterX = cutout.left + cutout.width / 2;
  const targetCenterY = cutout.top + cutout.height / 2;

  const spaceAbove = cutout.top - edgeMargin;
  const spaceBelow = cutout.containerH - (cutout.top + cutout.height) - edgeMargin;
  const spaceLeft = cutout.left - edgeMargin;
  const spaceRight = cutout.containerW - (cutout.left + cutout.width) - edgeMargin;

  const fitsBelow = spaceBelow >= tooltipEstimatedHeight + gap;
  const fitsAbove = spaceAbove >= tooltipEstimatedHeight + gap;
  const fitsRight = spaceRight >= tooltipWidth + gap;
  const fitsLeft = spaceLeft >= tooltipWidth + gap;

  let placement: 'above' | 'below' | 'left' | 'right';
  if (fitsBelow) {
    placement = 'below';
  } else if (fitsAbove) {
    placement = 'above';
  } else if (fitsRight) {
    placement = 'right';
  } else if (fitsLeft) {
    placement = 'left';
  } else {
    placement = spaceBelow >= spaceAbove ? 'below' : 'above';
  }

  let tooltipLeft: number;
  let tooltipTop: number;
  let arrowStartX: number;
  let arrowStartY: number;
  let arrowEndX: number;
  let arrowEndY: number;
  let ctrlX: number;
  let ctrlY: number;
  let showArrow: boolean;

  if (placement === 'right' || placement === 'left') {
    tooltipLeft =
      placement === 'right'
        ? cutout.left + cutout.width + gap
        : cutout.left - tooltipWidth - gap;
    tooltipLeft = Math.max(
      edgeMargin,
      Math.min(cutout.containerW - tooltipWidth - edgeMargin, tooltipLeft)
    );

    tooltipTop = Math.max(
      edgeMargin,
      Math.min(
        cutout.containerH - tooltipEstimatedHeight - edgeMargin,
        targetCenterY - tooltipEstimatedHeight / 2
      )
    );

    const tooltipCenterY = tooltipTop + tooltipEstimatedHeight / 2;
    arrowEndY = Math.max(
      cutout.top + 24,
      Math.min(cutout.top + cutout.height - 24, tooltipCenterY)
    );
    arrowStartY = Math.max(
      tooltipTop + 28,
      Math.min(
        tooltipTop + tooltipEstimatedHeight - 28,
        tooltipCenterY * 0.4 + arrowEndY * 0.6
      )
    );

    arrowStartX = placement === 'right' ? tooltipLeft : tooltipLeft + tooltipWidth;
    arrowEndX =
      placement === 'right'
        ? cutout.left + cutout.width + 16
        : cutout.left - 16;

    const horizontalClearance =
      placement === 'right'
        ? arrowStartX - (cutout.left + cutout.width)
        : cutout.left - arrowStartX;

    showArrow = horizontalClearance >= 24;
    ctrlX = (arrowStartX + arrowEndX) / 2;
    ctrlY = arrowEndY;
  } else {
    tooltipTop =
      placement === 'below'
        ? cutout.top + cutout.height + gap
        : cutout.top - tooltipEstimatedHeight - gap;

    tooltipTop = Math.max(
      edgeMargin,
      Math.min(cutout.containerH - tooltipEstimatedHeight - edgeMargin, tooltipTop)
    );

    tooltipLeft = targetCenterX - tooltipWidth / 2;
    tooltipLeft = Math.max(
      edgeMargin,
      Math.min(cutout.containerW - tooltipWidth - edgeMargin, tooltipLeft)
    );

    const tooltipCenterX = tooltipLeft + tooltipWidth / 2;

    arrowEndX = Math.max(
      cutout.left + 12,
      Math.min(cutout.left + cutout.width - 12, targetCenterX)
    );
    arrowStartX = Math.max(
      tooltipLeft + 28,
      Math.min(
        tooltipLeft + tooltipWidth - 28,
        tooltipCenterX * 0.35 + arrowEndX * 0.65
      )
    );

    arrowStartY =
      placement === 'below' ? tooltipTop : tooltipTop + tooltipEstimatedHeight;

    arrowEndY =
      placement === 'below'
        ? cutout.top + cutout.height + 16
        : cutout.top - 16;

    const verticalClearance =
      placement === 'below'
        ? arrowStartY - (cutout.top + cutout.height)
        : cutout.top - arrowStartY;

    showArrow = verticalClearance >= 24;
    ctrlX = arrowEndX;
    ctrlY = (arrowStartY + arrowEndY) / 2;
  }

  const arrowPathD = `M ${Math.round(arrowStartX)} ${Math.round(
    arrowStartY
  )} Q ${Math.round(ctrlX)} ${Math.round(ctrlY)} ${Math.round(
    arrowEndX
  )} ${Math.round(arrowEndY)}`;

  return {
    tooltipLeft: Math.round(tooltipLeft),
    tooltipTop: Math.round(tooltipTop),
    tooltipWidth: Math.round(tooltipWidth),
    placement,
    targetCenterX: Math.round(targetCenterX),
    targetCenterY: Math.round(targetCenterY),
    arrowStartX: Math.round(arrowStartX),
    arrowStartY: Math.round(arrowStartY),
    arrowEndX: Math.round(arrowEndX),
    arrowEndY: Math.round(arrowEndY),
    arrowPathD,
    showArrow,
  };
}
