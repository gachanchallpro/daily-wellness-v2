import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Check,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Eye,
  Lock,
  MapPin,
  Package,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  Wallet,
  X,
} from 'lucide-react';
import {
  CartItem,
  DeliveryMethod,
  DistrictFilter,
  EWalletType,
  SmartLockerLocation,
} from '../types';
import {
  COURIER_HINT_PLACEHOLDER,
  DISTRICT_FILTER_OPTIONS,
  SMART_LOCKER_LOCATIONS,
  formatVnd,
} from '../data/mockData';
import { QuantityControl } from './QuantityControl';
import { DiscreetLabelSliderCard } from './DiscreetLabelSliderCard';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';
import {
  calculateCheckoutSummary,
  canConfirmCheckout,
  filterLockersByDistrict,
  formatLockerCompactTitle,
  formatStep2DeliverySummary,
} from '../utils/storeLogic';

interface Screen5StealthCheckoutProps {
  cart: CartItem[];
  checkoutStep: 1 | 2;
  onChangeCheckoutStep: (step: 1 | 2) => void;
  deliveryMethod: DeliveryMethod;
  selectedLocker: SmartLockerLocation | null;
  districtFilter: DistrictFilter;
  eWallet: EWalletType;
  courierHint: string;
  courierNickname: string;
  orderCount: number;
  onUpdateQty: (productId: string, delta: number) => void;
  onSetQty: (productId: string, nextQty: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onChangeDeliveryMethod: (method: DeliveryMethod) => void;
  onSelectLocker: (locker: SmartLockerLocation) => void;
  onChangeDistrictFilter: (district: DistrictFilter) => void;
  onChangeEWallet: (wallet: EWalletType) => void;
  onChangeCourierHint: (hint: string) => void;
  onChangeCourierNickname: (nickname: string) => void;
  onConfirmOrder: () => void;
  onBackToCatalog: () => void;
  onOpenCourierTutorial: () => void;
  onOpenOrderList: () => void;
}

const COURIER_PRESETS: Record<Exclude<DistrictFilter, 'ALL'>, string> = {
  'Q.1': 'Sảnh chung cư P. Bến Nghé, Quận 1',
  'Q.3': 'Cổng bảo vệ 192 Võ Văn Tần, Quận 3',
  'Q.7': 'Cổng bảo vệ KTX ĐH Tôn Đức Thắng, Quận 7',
  'Q.10': 'Cổng sau ĐH Bách Khoa, Quận 10',
  'Bình Thạnh': 'Bàn bảo vệ đường D2 (Nguyễn Gia Trí), Bình Thạnh',
  'Gò Vấp': 'Cổng bảo vệ ĐH Công Nghiệp (IUH), Gò Vấp',
  'Tân Bình': 'Sảnh trệt Pico Plaza Cộng Hòa, Tân Bình',
  'Thủ Đức': 'Bàn bảo vệ KTX Khu B, TP. Thủ Đức',
};

const WALLET_OPTIONS: ReadonlyArray<{
  id: EWalletType;
  title: string;
  badge?: string;
  accentBg: string;
}> = [
  {
    id: 'Momo',
    title: 'Ví MoMo',
    badge: 'Phổ biến',
    accentBg: 'bg-[#FFD166]',
  },
  {
    id: 'ZaloPay',
    title: 'ZaloPay',
    accentBg: 'bg-[#95D5B2]',
  },
  {
    id: 'VietQR',
    title: 'Chuyển khoản VietQR',
    accentBg: 'bg-[#FDF6E9]',
  },
];

export const Screen5StealthCheckout: React.FC<Screen5StealthCheckoutProps> = ({
  cart,
  checkoutStep,
  onChangeCheckoutStep,
  deliveryMethod,
  selectedLocker,
  districtFilter,
  eWallet,
  courierHint,
  courierNickname,
  orderCount,
  onSetQty,
  onRemoveFromCart,
  onClearCart,
  onChangeDeliveryMethod,
  onSelectLocker,
  onChangeDistrictFilter,
  onChangeEWallet,
  onChangeCourierHint,
  onChangeCourierNickname,
  onConfirmOrder,
  onBackToCatalog,
  onOpenCourierTutorial,
  onOpenOrderList,
}) => {
  const { playSound } = useSoundFeedback();
  const [showLockerModal, setShowLockerModal] = useState<boolean>(false);
  const [showLabelModal, setShowLabelModal] = useState<boolean>(false);
  const [showBagEditor, setShowBagEditor] = useState<boolean>(false);

  const {
    totalQty,
    subtotalVnd: subtotal,
    deliveryFeeVnd: deliveryFee,
    totalVnd,
  } = calculateCheckoutSummary(cart, deliveryMethod);

  const previewOrderCode = `DW-${8821 + orderCount + totalQty}`;

  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-[#FDF6E9]">
        <div className="shrink-0 px-3.5 md:px-6 py-2 md:py-2.5 bg-white border-b-[2.5px] border-[#141413] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="min-h-[34px] px-2.5 rounded-lg border-[2px] border-[#141413] bg-[#FDF6E9] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1 font-mono text-[11px] font-bold text-[#141413] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </button>
          <span className="font-mono text-[11px] font-bold text-[#0F5C56]">
            Thanh toán kín
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FFD166] border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] flex items-center justify-center mb-4">
            <ShoppingBag className="w-6 h-6 text-[#141413]" />
          </div>
          <h2 className="font-display text-[19px] font-extrabold text-[#141413]">
            Túi hàng tạm đang trống!
          </h2>
          <p className="text-[13px] font-medium text-[#141413]/75 mt-1 max-w-[260px]">
            Ghé kệ nhà thuốc hoặc làm Quiz 30s để bỏ món vào túi kín đáo nha.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 w-full max-w-[240px]">
            <button
              type="button"
              onClick={onBackToCatalog}
              className="min-h-[44px] px-5 rounded-xl bg-[#0F5C56] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display text-[13.5px] font-bold cursor-pointer"
            >
              Xem kệ nhà thuốc
            </button>
            {orderCount > 0 && (
              <button
                type="button"
                onClick={onOpenOrderList}
                className="min-h-[42px] px-4 rounded-xl bg-[#FFD166] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] font-display text-[13px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span>Đơn của bạn ({orderCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const courierHintMissing =
    deliveryMethod === 'courier' && courierHint.trim().length === 0;
  const canProceedOrConfirm = canConfirmCheckout({
    deliveryMethod,
    selectedLocker,
    courierHint,
  });

  const filteredLockers = filterLockersByDistrict(
    SMART_LOCKER_LOCATIONS,
    districtFilter
  );

  const step2DeliverySummary = formatStep2DeliverySummary({
    deliveryMethod,
    selectedLocker,
    districtFilter,
    courierHint,
  });

  const handleHeaderBack = () => {
    triggerHaptic('tap');
    playSound('click');
    if (checkoutStep === 2) {
      onChangeCheckoutStep(1);
      return;
    }
    onBackToCatalog();
  };

  const handleGoStep2 = () => {
    if (!canProceedOrConfirm) return;
    triggerHaptic('tap');
    playSound('transition');
    onChangeCheckoutStep(2);
  };

  const renderWalletIcon = (walletId: EWalletType) => {
    if (walletId === 'VietQR') {
      return <QrCode className="w-4 h-4 stroke-[2.3]" />;
    }
    if (walletId === 'ZaloPay') {
      return <CreditCard className="w-4 h-4 stroke-[2.3]" />;
    }
    return <Wallet className="w-4 h-4 stroke-[2.3]" />;
  };

  const step2CtaLabel =
    deliveryMethod === 'locker'
      ? 'Xác nhận & Lấy mã OTP'
      : 'Xác nhận đặt đơn kín';

  const renderPrimaryActionButton = (isMobileFooter = false) => {
    if (checkoutStep === 1) {
      return (
        <button
          type="button"
          onClick={handleGoStep2}
          disabled={!canProceedOrConfirm}
          className={`w-full ${
            isMobileFooter
              ? 'min-h-[44px] text-[12.5px] px-3.5'
              : 'min-h-[48px] text-[14px] px-4'
          } rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] disabled:bg-zinc-300 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display font-extrabold flex items-center justify-between gap-2 transition-all cursor-pointer`}
        >
          <span className="truncate">
            {!canProceedOrConfirm
              ? deliveryMethod === 'courier'
                ? 'Nhập điểm thả hàng để tiếp tục'
                : 'Chọn tủ Smart Locker để tiếp tục'
              : 'Tiếp tục: Chọn thanh toán'}
          </span>
          <ArrowRight className="w-4 h-4 stroke-[2.6] shrink-0" />
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={onConfirmOrder}
        disabled={!canProceedOrConfirm}
        className={`w-full ${
          isMobileFooter
            ? 'min-h-[44px] text-[12.5px] px-3.5'
            : 'min-h-[48px] text-[14px] px-4'
        } rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] disabled:bg-zinc-300 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display font-extrabold flex items-center justify-between gap-2 transition-all cursor-pointer`}
      >
        <span className="truncate">{step2CtaLabel}</span>
        <span
          className={`${
            isMobileFooter
              ? 'px-2 py-0.5 text-[11px]'
              : 'px-2.5 py-0.5 text-[12px]'
          } rounded-lg bg-[#FFD166] text-[#141413] font-mono font-extrabold tabular-nums shrink-0 border border-[#141413]`}
        >
          {formatVnd(totalVnd)}
        </span>
      </button>
    );
  };

  const desktopSummaryPanel = (
    <aside
      aria-label="Tóm tắt đơn hàng và thao tác thanh toán"
      className="hidden md:flex md:col-span-5 md:sticky md:top-0 flex-col gap-3.5 rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[5px_5px_0_#141413] p-5 min-w-0"
    >
      <div className="flex items-center justify-between gap-2 border-b-[2px] border-dashed border-[#141413]/25 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <ShoppingBag className="w-4 h-4 text-[#0F5C56] shrink-0" />
          <h2 className="font-display text-[16px] font-extrabold text-[#141413] truncate">
            Đơn hàng kín ({totalQty})
          </h2>
        </div>
        <button
          type="button"
          onClick={onClearCart}
          className="font-mono text-[11px] font-bold text-[#F26B50] hover:underline cursor-pointer shrink-0"
        >
          Xoá hết
        </button>
      </div>

      <div className="space-y-2 max-h-[240px] overflow-y-auto pr-0.5">
        {cart.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="rounded-xl bg-[#FDF6E9] border-[1.5px] border-[#141413]/35 p-2.5 flex items-center justify-between gap-2 min-w-0"
          >
            <div className="min-w-0 flex-1">
              <p className="font-display text-[13px] font-extrabold text-[#141413] leading-snug break-words">
                {product.shortName}
              </p>
              <p className="font-mono text-[11px] font-semibold text-[#0F5C56] tabular-nums">
                {formatVnd(product.priceVnd * quantity)}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <QuantityControl
                value={quantity}
                onChange={(nextQty) => onSetQty(product.id, nextQty)}
                onDecrementAtOne={() => onRemoveFromCart(product.id)}
                itemLabel={product.shortName}
                size="sm"
                bgTone="white"
              />
              <button
                type="button"
                onClick={() => onRemoveFromCart(product.id)}
                aria-label={`Xoá ${product.shortName} khỏi đơn`}
                title={`Xoá ${product.shortName}`}
                className="w-8 h-8 rounded-lg border-[1.5px] border-[#141413] bg-[#F26B50]/20 hover:bg-[#F26B50] flex items-center justify-center text-[#141413] cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-[#95D5B2]/35 border-[2px] border-[#141413] p-3 space-y-1.5">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase text-[#0F5C56]">
            Nơi nhận đã chọn
          </span>
          <p className="text-[12px] font-bold text-[#141413] leading-snug break-words">
            {step2DeliverySummary}
          </p>
        </div>
        <div className="pt-1.5 border-t border-dashed border-[#141413]/25 flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-bold uppercase text-[#0F5C56]">
            Thanh toán qua
          </span>
          <span className="font-mono text-[11.5px] font-bold text-[#141413]">
            {eWallet}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 pt-1 border-t border-dashed border-[#141413]/25 font-mono text-[12px]">
        <div className="flex items-center justify-between text-[#141413]/75">
          <span>Tạm tính ({totalQty} món)</span>
          <span className="tabular-nums font-semibold">
            {formatVnd(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between text-[#141413]/75">
          <span>
            {deliveryMethod === 'locker' ? 'Phí tủ 24/7' : 'Phí giao thả 30p'}
          </span>
          <span className="tabular-nums font-semibold">
            {deliveryFee === 0 ? 'Miễn phí (0đ)' : formatVnd(deliveryFee)}
          </span>
        </div>
        <div className="flex items-baseline justify-between pt-2 border-t border-[#141413]/20">
          <span className="font-display text-[14px] font-extrabold text-[#141413]">
            Tổng thanh toán
          </span>
          <span className="font-mono text-[19px] font-bold text-[#0F5C56] tabular-nums">
            {formatVnd(totalVnd)}
          </span>
        </div>
      </div>

      {renderPrimaryActionButton(false)}
    </aside>
  );

  return (
    <div className="relative flex-1 flex flex-col min-h-0 min-w-0 bg-[#FDF6E9]">
      {/* Header Stepper gọn 1 dòng: Quay lại + 1. Nhận hàng -> 2. Thanh toán */}
      <div className="shrink-0 px-3.5 md:px-6 py-1.5 md:py-2 bg-white border-b-[2.5px] border-[#141413] flex items-center justify-between gap-2 min-w-0">
        <button
          type="button"
          onClick={handleHeaderBack}
          aria-label={
            checkoutStep === 2 ? 'Quay lại bước Nhận hàng' : 'Quay lại chọn món'
          }
          className="min-h-[32px] px-2.5 rounded-lg border-[2px] border-[#141413] bg-[#FDF6E9] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1 font-mono text-[11px] font-bold text-[#141413] cursor-pointer shrink-0 whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{checkoutStep === 2 ? 'Quay lại' : 'Thêm món'}</span>
        </button>

        <nav
          aria-label="Tiến trình thanh toán 2 bước"
          className="flex items-center gap-1 min-w-0 overflow-hidden"
        >
          <button
            type="button"
            onClick={() => {
              if (checkoutStep === 2) {
                triggerHaptic('tap');
                playSound('click');
                onChangeCheckoutStep(1);
              }
            }}
            aria-current={checkoutStep === 1 ? 'step' : undefined}
            className={`px-2 py-1 rounded-md border-[1.5px] font-mono text-[10px] md:text-[11px] font-extrabold whitespace-nowrap shrink-0 transition-colors ${
              checkoutStep === 1
                ? 'bg-[#FFD166] border-[#141413] text-[#141413]'
                : 'bg-[#95D5B2]/45 border-[#141413]/40 text-[#0F5C56] cursor-pointer hover:bg-[#95D5B2]'
            }`}
          >
            1. Nhận hàng
          </button>

          <ChevronRight
            className="w-3.5 h-3.5 text-[#141413]/50 shrink-0"
            aria-hidden="true"
          />

          <span
            aria-current={checkoutStep === 2 ? 'step' : undefined}
            className={`px-2 py-1 rounded-md border-[1.5px] font-mono text-[10px] md:text-[11px] font-extrabold whitespace-nowrap shrink-0 ${
              checkoutStep === 2
                ? 'bg-[#FFD166] border-[#141413] text-[#141413]'
                : 'bg-[#FDF6E9] border-[#141413]/25 text-[#141413]/55'
            }`}
          >
            2. Thanh toán
          </span>
        </nav>
      </div>

      {/* Nội dung chính 2 bước */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar px-3.5 py-2.5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
          <div className="md:col-span-7 flex flex-col gap-2.5 md:gap-3.5 min-w-0">
            {checkoutStep === 1 ? (
              <>
                {/* Khối túi hàng thu gọn trên Mobile */}
                <section
                  aria-label="Sản phẩm trong túi"
                  className="md:hidden rounded-xl bg-white border-2 border-[#141413] shadow-[3px_3px_0_#141413] px-3 py-2 min-w-0"
                >
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    {cart.length === 1 ? (
                      <>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-[13px] font-extrabold text-[#141413] leading-tight truncate">
                            {cart[0].product.shortName}
                          </p>
                          <p className="font-mono text-[11px] font-bold text-[#0F5C56] tabular-nums">
                            {formatVnd(cart[0].product.priceVnd * cart[0].quantity)}
                          </p>
                        </div>
                        <QuantityControl
                          value={cart[0].quantity}
                          onChange={(nextQty) => onSetQty(cart[0].product.id, nextQty)}
                          onDecrementAtOne={() => onRemoveFromCart(cart[0].product.id)}
                          itemLabel={cart[0].product.shortName}
                          size="sm"
                          bgTone="cream"
                        />
                      </>
                    ) : (
                      <>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-[13px] font-extrabold text-[#141413] truncate">
                            Trong túi ({totalQty} món)
                          </p>
                          <p className="font-mono text-[11px] font-bold text-[#0F5C56] tabular-nums truncate">
                            {cart
                              .map((c) => `${c.product.shortName} ×${c.quantity}`)
                              .join(' · ')}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic('tap');
                            playSound('click');
                            setShowBagEditor(true);
                          }}
                          className="min-h-[34px] px-2.5 rounded-lg bg-[#FFD166] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] font-mono text-[10.5px] font-bold text-[#141413] cursor-pointer shrink-0 whitespace-nowrap"
                        >
                          Sửa túi
                        </button>
                      </>
                    )}
                  </div>
                </section>

                {/* Segmented Toggle: Tủ Smart Locker | Giao thả 30p */}
                <div
                  role="tablist"
                  aria-label="Chọn hình thức nhận hàng"
                  className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413]"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={deliveryMethod === 'locker'}
                    onClick={() => {
                      triggerHaptic('toggle');
                      playSound('toggle');
                      onChangeDeliveryMethod('locker');
                    }}
                    className={`min-h-[42px] px-2 rounded-lg border-[2px] flex items-center justify-center gap-1.5 font-display text-[12.5px] md:text-[13.5px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                      deliveryMethod === 'locker'
                        ? 'bg-[#95D5B2] border-[#141413] text-[#141413] shadow-[2px_2px_0_#141413]'
                        : 'bg-transparent border-transparent text-[#141413]/70 hover:bg-[#FDF6E9]'
                    }`}
                  >
                    <Box className="w-4 h-4 shrink-0" />
                    <span>Tủ Smart Locker</span>
                    <span className="font-mono text-[10px] font-bold text-[#0F5C56]">
                      0đ
                    </span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={deliveryMethod === 'courier'}
                    onClick={() => {
                      triggerHaptic('toggle');
                      playSound('toggle');
                      onChangeDeliveryMethod('courier');
                    }}
                    className={`min-h-[42px] px-2 rounded-lg border-[2px] flex items-center justify-center gap-1.5 font-display text-[12.5px] md:text-[13.5px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                      deliveryMethod === 'courier'
                        ? 'bg-[#FFD166] border-[#141413] text-[#141413] shadow-[2px_2px_0_#141413]'
                        : 'bg-transparent border-transparent text-[#141413]/70 hover:bg-[#FDF6E9]'
                    }`}
                  >
                    <Truck className="w-4 h-4 shrink-0" />
                    <span>Giao thả 30p</span>
                    <span className="font-mono text-[10px] font-bold text-[#141413]">
                      18k
                    </span>
                  </button>
                </div>

                {/* Chi tiết Bước 1 theo phương thức */}
                {deliveryMethod === 'locker' ? (
                  <div className="space-y-2 min-w-0">
                    {/* 1 Thẻ tủ đang chọn thật gọn + nút Đổi tủ */}
                    <section
                      data-tutorial-target="checkout-locker-list"
                      aria-label="Tủ Smart Locker đang chọn"
                      className="rounded-xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-3 md:p-4 space-y-2 min-w-0"
                    >
                      <div className="flex items-start justify-between gap-2.5 min-w-0">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <span className="w-9 h-9 rounded-xl bg-[#95D5B2] border-[2px] border-[#141413] flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-4.5 h-4.5 text-[#141413]" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <h1 className="font-display text-[14.5px] md:text-[16px] font-extrabold text-[#141413] leading-snug break-words">
                              {selectedLocker
                                ? formatLockerCompactTitle(selectedLocker)
                                : 'Chưa chọn tủ Smart Locker'}
                            </h1>
                            <p className="text-[11.5px] md:text-[12.5px] font-medium text-[#141413]/80 leading-snug mt-0.5 break-words">
                              {selectedLocker
                                ? selectedLocker.addressHint
                                : 'Bấm Đổi tủ để chọn trạm nhận 24/7 gần bạn.'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic('tap');
                            playSound('click');
                            setShowLockerModal(true);
                          }}
                          className="min-h-[38px] px-3 rounded-xl bg-[#FFD166] hover:bg-[#95D5B2] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-mono text-[11px] font-extrabold text-[#141413] shrink-0 whitespace-nowrap cursor-pointer transition-colors"
                        >
                          Đổi tủ
                        </button>
                      </div>

                      {selectedLocker && (
                        <div className="pt-2 border-t border-dashed border-[#141413]/20 flex items-center justify-between gap-2 font-mono text-[10.5px] font-bold">
                          <span className="text-[#0F5C56]">
                            Còn ngăn trống 24/7 ({selectedLocker.availableSlots} ô)
                          </span>
                          <span className="text-[#141413]/65">
                            {selectedLocker.lockerCode}
                          </span>
                        </div>
                      )}
                    </section>

                    {/* 1 dòng badge bảo mật OTP duy nhất */}
                    <div className="rounded-lg bg-[#95D5B2]/45 border-[2px] border-[#141413] px-3 py-1.5 flex items-center gap-2 text-[#141413]">
                      <Lock className="w-3.5 h-3.5 text-[#0F5C56] shrink-0" />
                      <p className="font-mono text-[10.5px] md:text-[11px] font-bold leading-tight">
                        Mở tủ bằng mã OTP ẩn danh · Không cần gặp shipper
                      </p>
                    </div>
                  </div>
                ) : (
                  <section
                    data-tutorial-target="checkout-locker-list"
                    aria-label="Thông tin giao thả 30 phút"
                    className="rounded-xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-3 md:p-4 space-y-2.5 min-w-0"
                  >
                    <div className="space-y-1.5">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#141413]/70">
                        Chọn nhanh quận (Không cần chia sẻ GPS)
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {DISTRICT_FILTER_OPTIONS.map((dist) => {
                          const active = districtFilter === dist.label;
                          return (
                            <button
                              key={dist.label}
                              type="button"
                              onClick={() => {
                                triggerHaptic('toggle');
                                playSound('toggle');
                                onChangeDistrictFilter(dist.label);
                                onChangeCourierHint(COURIER_PRESETS[dist.label]);
                              }}
                              className={`min-h-[28px] px-2.5 rounded-lg border-[2px] border-[#141413] font-mono text-[10.5px] font-bold transition-all cursor-pointer ${
                                active
                                  ? 'bg-[#FFD166] text-[#141413] shadow-none translate-x-[1px] translate-y-[1px]'
                                  : 'bg-[#FDF6E9] text-[#141413] shadow-[2px_2px_0_#141413]'
                              }`}
                            >
                              {dist.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-8 space-y-1">
                        <label
                          htmlFor="courier-dropoff-note"
                          className="block font-mono text-[10.5px] font-bold text-[#141413]"
                        >
                          Điểm thả hàng (cổng, bàn bảo vệ, sảnh)
                        </label>
                        <input
                          id="courier-dropoff-note"
                          type="text"
                          value={courierHint}
                          onChange={(e) => onChangeCourierHint(e.target.value)}
                          placeholder={COURIER_HINT_PLACEHOLDER}
                          aria-invalid={courierHintMissing}
                          className={`w-full h-10 px-2.5 rounded-lg border-[2px] text-[12px] font-medium text-[#141413] placeholder:text-[#141413]/45 focus:outline-none focus:bg-white ${
                            courierHintMissing
                              ? 'bg-[#FFF5F2] border-[#F26B50]'
                              : 'bg-[#FDF6E9] border-[#141413]'
                          }`}
                        />
                      </div>

                      <div className="sm:col-span-4 space-y-1">
                        <label
                          htmlFor="courier-nickname-input"
                          className="block font-mono text-[10.5px] font-bold text-[#141413]"
                        >
                          Biệt danh nhận
                        </label>
                        <input
                          id="courier-nickname-input"
                          type="text"
                          value={courierNickname}
                          onChange={(e) =>
                            onChangeCourierNickname(e.target.value)
                          }
                          placeholder="Khách DW"
                          className="w-full h-10 px-2.5 rounded-lg border-[2px] border-[#141413] bg-[#FDF6E9] text-[12px] font-bold text-[#141413] placeholder:text-[#141413]/45 focus:outline-none focus:bg-white"
                        />
                      </div>
                    </div>

                    {courierHintMissing && (
                      <p
                        role="alert"
                        className="font-mono text-[10.5px] font-bold text-[#B8321A] leading-snug"
                      >
                        * Nhập điểm thả hàng hoặc chạm 1 quận ở trên để tiếp tục.
                      </p>
                    )}
                  </section>
                )}

                {/* Khối Cam kết đóng gói gọn nhẹ: Tem hộp 0 danh tính + nút Xem thử hộp */}
                <section
                  data-tutorial-target="label-compare-slider"
                  aria-label="Cam kết đóng gói Tem hộp 0 danh tính"
                  className="rounded-xl bg-white border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] px-3 py-2.5 flex items-center justify-between gap-2.5 min-w-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="w-9 h-9 rounded-xl bg-[#FDF6E9] border-[2px] border-[#141413] flex items-center justify-center shrink-0">
                      <Package className="w-4.5 h-4.5 text-[#0F5C56]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[13px] md:text-[14px] font-extrabold text-[#141413] leading-tight">
                        Tem hộp 0 danh tính
                      </p>
                      <p className="text-[11px] md:text-[12px] font-medium text-[#141413]/75 leading-snug mt-0.5">
                        Hộp trơn · 0 tên shop &amp; tên món
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap');
                      playSound('transition');
                      setShowLabelModal(true);
                    }}
                    className="min-h-[38px] px-3 rounded-xl bg-[#FDF6E9] hover:bg-[#FFD166] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-mono text-[11px] font-extrabold text-[#141413] inline-flex items-center gap-1 shrink-0 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem thử hộp</span>
                  </button>
                </section>
              </>
            ) : (
              <>
                {/* BƯỚC 2: Thanh tóm tắt đơn thu gọn 1 dòng + nút Sửa */}
                <section
                  aria-label="Tóm tắt nơi nhận đã chọn"
                  className="rounded-xl bg-[#95D5B2]/55 border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] px-3 py-2.5 flex items-center justify-between gap-2.5 min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[13px] md:text-[14px] font-extrabold text-[#141413] truncate">
                      {step2DeliverySummary}
                    </p>
                    <p className="font-mono text-[11px] font-bold text-[#0F5C56] tabular-nums">
                      Tổng: {formatVnd(totalVnd)} ({totalQty} món)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap');
                      playSound('click');
                      onChangeCheckoutStep(1);
                    }}
                    className="min-h-[34px] px-3 rounded-lg bg-white hover:bg-[#FFD166] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-mono text-[11px] font-extrabold text-[#141413] shrink-0 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    Sửa
                  </button>
                </section>

                {/* BƯỚC 2: Chọn phương thức thanh toán (MoMo / ZaloPay / VietQR) */}
                <section aria-label="Chọn phương thức thanh toán" className="space-y-2.5 min-w-0">
                  <h1 className="font-display text-[15.5px] md:text-[17px] font-extrabold text-[#141413]">
                    Chọn ví thanh toán ẩn danh
                  </h1>

                  <div
                    role="radiogroup"
                    aria-label="Phương thức thanh toán"
                    className="flex flex-col gap-2.5"
                  >
                    {WALLET_OPTIONS.map((wallet) => {
                      const isSelected = eWallet === wallet.id;
                      return (
                        <button
                          key={wallet.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => {
                            triggerHaptic('toggle');
                            playSound('toggle');
                            onChangeEWallet(wallet.id);
                          }}
                          className={`w-full p-3 md:p-3.5 rounded-xl border-[2.5px] border-[#141413] text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FFD166]/45 shadow-none translate-x-[2px] translate-y-[2px]'
                              : 'bg-white hover:bg-[#FFFDF8] shadow-[3px_3px_0_#141413]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 md:gap-3">
                            <span
                              className={`w-9 h-9 rounded-xl border-[2px] border-[#141413] flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-[#141413] text-[#FFD166]'
                                  : `${wallet.accentBg} text-[#141413]`
                              }`}
                            >
                              {renderWalletIcon(wallet.id)}
                            </span>

                            <div className="flex-1 min-w-0 flex items-center gap-2">
                              <span className="font-display text-[14px] md:text-[15px] font-extrabold text-[#141413] leading-snug">
                                {wallet.title}
                              </span>
                              {wallet.badge && (
                                <span className="px-1.5 py-0.5 rounded bg-[#95D5B2] border border-[#141413] font-mono text-[9.5px] font-bold text-[#141413] shrink-0">
                                  {wallet.badge}
                                </span>
                              )}
                            </div>

                            <span
                              aria-hidden="true"
                              className={`w-6 h-6 rounded-full border-[2px] border-[#141413] flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#0F5C56] text-white'
                                  : 'bg-white'
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              )}
                            </span>
                          </div>

                          {isSelected && (
                            <p className="mt-2 pt-2 border-t border-dashed border-[#141413]/25 font-sans text-[11.5px] md:text-[12px] font-semibold text-[#0F5C56] leading-snug flex items-start gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span>
                                Nội dung chuyển khoản chỉ hiện mã đơn{' '}
                                <strong className="font-mono text-[#141413]">
                                  {previewOrderCode}
                                </strong>
                                , không lưu tên sản phẩm trên sao kê ví/ngân hàng.
                              </span>
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>

          {desktopSummaryPanel}
        </div>
      </main>

      {/* Mobile Sticky Footer cho Bước 1 & Bước 2 */}
      <footer className="md:hidden shrink-0 bg-[#FDF6E9] border-t-[2.5px] border-[#141413] px-3.5 py-2 space-y-1.5">
        <div className="flex items-center justify-between gap-2 font-mono text-[11px] leading-tight">
          <span className="text-[#141413]/80">
            Tạm tính {formatVnd(subtotal)} ·{' '}
            {deliveryFee === 0
              ? 'Tủ 0đ'
              : `Giao 30p ${formatVnd(deliveryFee)}`}
          </span>
          <span className="tabular-nums font-extrabold text-[#0F5C56]">
            {formatVnd(totalVnd)}
          </span>
        </div>
        {renderPrimaryActionButton(true)}
      </footer>

      {/* Bottom Sheet / Modal Đổi tủ Smart Locker */}
      {showLockerModal && (
        <div
          onClick={() => setShowLockerModal(false)}
          className="absolute inset-0 z-40 bg-[#141413]/70 p-3 md:p-6 flex items-end sm:items-center justify-center animate-spring-pop"
          role="dialog"
          aria-modal="true"
          aria-label="Chọn trạm Smart Locker 24/7"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#FDF6E9] border-[3px] border-[#141413] rounded-2xl shadow-[5px_5px_0_#141413] overflow-hidden flex flex-col max-h-[82dvh]"
          >
            <div className="bg-[#95D5B2] border-b-[2.5px] border-[#141413] px-4 py-2.5 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-[#141413] shrink-0" />
                <p className="font-display text-[15px] font-extrabold text-[#141413] truncate">
                  Chọn trạm Smart Locker 24/7
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLockerModal(false)}
                aria-label="Đóng danh sách tủ"
                className="w-8 h-8 rounded-lg bg-white border-[2px] border-[#141413] flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="px-3.5 pt-3 pb-2 border-b border-dashed border-[#141413]/25 shrink-0">
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('toggle');
                    playSound('toggle');
                    onChangeDistrictFilter('ALL');
                  }}
                  className={`min-h-[28px] px-2.5 rounded-lg border-[2px] border-[#141413] font-mono text-[10.5px] font-bold cursor-pointer ${
                    districtFilter === 'ALL'
                      ? 'bg-[#FFD166] text-[#141413]'
                      : 'bg-white text-[#141413]'
                  }`}
                >
                  Tất cả ({SMART_LOCKER_LOCATIONS.length})
                </button>
                {DISTRICT_FILTER_OPTIONS.map((dist) => {
                  const active = districtFilter === dist.label;
                  return (
                    <button
                      key={dist.label}
                      type="button"
                      onClick={() => {
                        triggerHaptic('toggle');
                        playSound('toggle');
                        onChangeDistrictFilter(dist.label);
                      }}
                      className={`min-h-[28px] px-2.5 rounded-lg border-[2px] border-[#141413] font-mono text-[10.5px] font-bold cursor-pointer ${
                        active
                          ? 'bg-[#FFD166] text-[#141413]'
                          : 'bg-white text-[#141413]'
                      }`}
                    >
                      {dist.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 space-y-2 overflow-y-auto no-scrollbar">
              {filteredLockers.map((loc) => {
                const isSelected = selectedLocker?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('toggle');
                      playSound('toggle');
                      onSelectLocker(loc);
                      onChangeDistrictFilter(loc.districtShort);
                      setShowLockerModal(false);
                    }}
                    className={`w-full p-3 rounded-xl border-[2px] border-[#141413] text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFD166] shadow-none translate-x-[1px] translate-y-[1px]'
                        : 'bg-white hover:bg-[#FFFDF8] shadow-[2px_2px_0_#141413]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[13.5px] font-extrabold text-[#141413] leading-snug">
                        {formatLockerCompactTitle(loc)}
                      </p>
                      <p className="text-[11.5px] font-medium text-[#141413]/75 leading-snug mt-0.5">
                        {loc.addressHint}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-[#95D5B2] border-[1.5px] border-[#141413] font-mono text-[10px] font-extrabold text-[#141413] shrink-0 whitespace-nowrap">
                      Còn {loc.availableSlots} ô
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem thử hộp & Đối chiếu tem bọc kín */}
      {showLabelModal && (
        <div
          onClick={() => setShowLabelModal(false)}
          className="absolute inset-0 z-40 bg-[#141413]/70 p-3 md:p-6 flex items-end sm:items-center justify-center animate-spring-pop"
          role="dialog"
          aria-modal="true"
          aria-label="Xem thử hộp và đối chiếu tem bọc kín"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#FDF6E9] border-[3px] border-[#141413] rounded-2xl shadow-[5px_5px_0_#141413] overflow-hidden"
          >
            <div className="bg-[#FFD166] border-b-[2.5px] border-[#141413] px-4 py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#141413]" />
                <p className="font-display text-[15px] font-extrabold text-[#141413]">
                  Xem thử hộp &amp; Tem 0 danh tính
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLabelModal(false)}
                aria-label="Đóng xem thử hộp"
                className="w-8 h-8 rounded-lg bg-white border-[2px] border-[#141413] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-3.5 space-y-2.5">
              <DiscreetLabelSliderCard orderCode={previewOrderCode} compact />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLabelModal(false);
                    onOpenCourierTutorial();
                  }}
                  className="flex-1 min-h-[38px] px-3 rounded-xl bg-white hover:bg-[#95D5B2]/45 border-[2px] border-[#141413] font-mono text-[11px] font-bold text-[#141413] cursor-pointer"
                >
                  So sánh mẫu sàn TMĐT →
                </button>
                <button
                  type="button"
                  onClick={() => setShowLabelModal(false)}
                  className="min-h-[38px] px-4 rounded-xl bg-[#0F5C56] text-[#FDF6E9] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] font-display text-[12.5px] font-bold cursor-pointer"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xoá / Sửa sản phẩm trong túi */}
      {showBagEditor && (
        <div
          onClick={() => setShowBagEditor(false)}
          className="absolute inset-0 z-40 bg-[#141413]/70 p-4 flex items-center justify-center animate-spring-pop"
          role="dialog"
          aria-modal="true"
          aria-label="Chỉnh sửa hoặc xoá sản phẩm trong túi"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#FDF6E9] border-[3px] border-[#141413] rounded-2xl shadow-[5px_5px_0_#141413] overflow-hidden"
          >
            <div className="bg-[#FFD166] border-b-[2.5px] border-[#141413] px-4 py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#141413]" />
                <p className="font-display text-[15px] font-extrabold text-[#141413]">
                  Sản phẩm trong túi ({totalQty})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBagEditor(false)}
                aria-label="Đóng chỉnh sửa túi"
                className="w-8 h-8 rounded-lg bg-white border-[2px] border-[#141413] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-3.5 space-y-2.5 max-h-[55dvh] overflow-y-auto no-scrollbar">
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="rounded-xl bg-white border-2 border-[#141413] p-2.5 flex items-center justify-between gap-2 min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[13.5px] font-extrabold text-[#141413] leading-snug break-words">
                      {product.shortName}
                    </p>
                    <p className="font-mono text-[11.5px] font-bold text-[#0F5C56] tabular-nums">
                      {formatVnd(product.priceVnd * quantity)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <QuantityControl
                      value={quantity}
                      onChange={(nextQty) => onSetQty(product.id, nextQty)}
                      onDecrementAtOne={() => onRemoveFromCart(product.id)}
                      itemLabel={product.shortName}
                      size="sm"
                      bgTone="cream"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(product.id)}
                      aria-label={`Xoá ${product.shortName}`}
                      className="px-2 h-8 rounded-lg border-[1.5px] border-[#141413] bg-[#F26B50] hover:bg-[#EA5B3F] font-mono text-[10.5px] font-bold text-[#141413] flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xoá</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-3.5 py-2.5 bg-white border-t-[2px] border-[#141413] flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClearCart();
                  setShowBagEditor(false);
                }}
                className="min-h-[38px] px-3 rounded-xl bg-[#F26B50]/25 hover:bg-[#F26B50] border-[2px] border-[#141413] font-mono text-[11px] font-bold text-[#141413] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xoá hết túi</span>
              </button>
              <button
                type="button"
                onClick={() => setShowBagEditor(false)}
                className="flex-1 min-h-[38px] rounded-xl bg-[#0F5C56] text-[#FDF6E9] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] font-display text-[13px] font-bold cursor-pointer"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
