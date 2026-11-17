import React, { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  AlertTriangle,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  Copy,
  Home,
  Lock,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Truck,
} from 'lucide-react';
import { OrderSnapshot } from '../types';
import { PRODUCTS, formatVnd } from '../data/mockData';
import { DiscreetParcelSvg, SmartLockerSvg } from './ProductArtwork';
import { SmartLockerLocationCard } from './SmartLockerMap';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';
import {
  ANONYMOUS_REVIEW_TAGS,
  ORDER_GENERAL_REVIEW_TARGET,
  getOrderReviewTargets,
  isOrderCompleted,
} from '../utils/storeLogic';

interface Screen6OtpPickupProps {
  order: OrderSnapshot;
  orderCount: number;
  pendingOtherOrderCount: number;
  onConfirmReceived: (orderId: string) => void;
  onSubmitReview: (
    orderId: string,
    payload: {
      rating: number;
      tags: string[];
      comment: string;
      targetProductId?: string;
      targetProductLabel?: string;
    }
  ) => void;
  onSaveAndHome: () => void;
  onOpenOrderList: () => void;
  onDeleteOrder: (orderId: string) => void;
  onWipeComplete: () => void;
}

export const Screen6OtpPickup: React.FC<Screen6OtpPickupProps> = ({
  order,
  orderCount,
  pendingOtherOrderCount,
  onConfirmReceived,
  onSubmitReview,
  onSaveAndHome,
  onOpenOrderList,
  onDeleteOrder,
  onWipeComplete,
}) => {
  const { playSound } = useSoundFeedback();
  const [showInsideBox, setShowInsideBox] = useState<boolean>(false);
  const reviewTargets = getOrderReviewTargets(order, PRODUCTS);
  const defaultReviewTargetId =
    reviewTargets.length === 1
      ? reviewTargets[0].id
      : ORDER_GENERAL_REVIEW_TARGET;

  const [reviewRating, setReviewRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [selectedReviewTargetId, setSelectedReviewTargetId] = useState<string>(
    defaultReviewTargetId
  );
  const [confirmWipe, setConfirmWipe] = useState<boolean>(false);
  const [showPendingWipeModal, setShowPendingWipeModal] =
    useState<boolean>(false);
  const [wipingState, setWipingState] = useState<'idle' | 'erasing' | 'done'>(
    'idle'
  );
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>(
    'idle'
  );

  const wipeTimer1Ref = useRef<number | null>(null);
  const wipeTimer2Ref = useRef<number | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const nextTargets = getOrderReviewTargets(order, PRODUCTS);
    setReviewRating(order.reviewSubmitted?.rating ?? 0);
    setSelectedTags(order.reviewSubmitted?.tags ?? []);
    setReviewComment(order.reviewSubmitted?.comment ?? '');
    setSelectedReviewTargetId(
      order.reviewSubmitted?.targetProductId ??
        (nextTargets.length === 1
          ? nextTargets[0].id
          : ORDER_GENERAL_REVIEW_TARGET)
    );
    setConfirmWipe(false);
    setShowPendingWipeModal(false);
    setCopyStatus('idle');
  }, [order.id, order.productIds, order.reviewSubmitted]);

  useEffect(() => {
    return () => {
      if (wipeTimer1Ref.current !== null) {
        window.clearTimeout(wipeTimer1Ref.current);
      }
      if (wipeTimer2Ref.current !== null) {
        window.clearTimeout(wipeTimer2Ref.current);
      }
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const isCompleted = isOrderCompleted(order);
  const submittedReview = order.reviewSubmitted;
  const qrPayload = `${order.orderCode}|${order.otpDigits}|${order.lockerLocation.lockerCode}`;

  const copyViaExecCommand = (text: string): boolean => {
    if (typeof document === 'undefined' || !document.body) return false;
    let textarea: HTMLTextAreaElement | null = null;
    try {
      textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      if (textarea && textarea.parentNode) {
        textarea.parentNode.removeChild(textarea);
      }
    }
  };

  const handleCopyOtp = async () => {
    const cleanOtp = order.otpDigits.replace(/[^0-9]/g, '');
    let copiedSuccessfully = false;

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(cleanOtp);
        copiedSuccessfully = true;
      } else {
        copiedSuccessfully = copyViaExecCommand(cleanOtp);
      }
    } catch {
      copiedSuccessfully = copyViaExecCommand(cleanOtp);
    }

    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }

    if (copiedSuccessfully) {
      triggerHaptic('success');
      playSound('success');
      setCopyStatus('copied');
      copyTimerRef.current = window.setTimeout(() => {
        setCopyStatus('idle');
      }, 2000);
    } else {
      triggerHaptic('warning');
      playSound('alert');
      setCopyStatus('failed');
      copyTimerRef.current = window.setTimeout(() => {
        setCopyStatus('idle');
      }, 4500);
    }
  };

  const handleConfirmReceivedClick = () => {
    if (isCompleted) return;
    triggerHaptic('success');
    playSound('success');
    onConfirmReceived(order.id);
  };

  const handleToggleTag = (tag: string) => {
    triggerHaptic('toggle');
    playSound('toggle');
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleSendAnonymousReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating < 1 || submittedReview) return;
    triggerHaptic('success');
    playSound('success');
    const matchedTarget = reviewTargets.find(
      (item) => item.id === selectedReviewTargetId
    );
    onSubmitReview(order.id, {
      rating: reviewRating,
      tags: selectedTags,
      comment: reviewComment,
      targetProductId: matchedTarget
        ? matchedTarget.id
        : ORDER_GENERAL_REVIEW_TARGET,
      targetProductLabel: matchedTarget
        ? matchedTarget.label
        : 'Đánh giá chung cho đơn hàng',
    });
  };

  const handleConfirmWipe = () => {
    setShowPendingWipeModal(false);
    setConfirmWipe(false);
    triggerHaptic('warning');
    playSound('alert');
    setWipingState('erasing');
    if (wipeTimer1Ref.current !== null) {
      window.clearTimeout(wipeTimer1Ref.current);
    }
    if (wipeTimer2Ref.current !== null) {
      window.clearTimeout(wipeTimer2Ref.current);
    }
    wipeTimer1Ref.current = window.setTimeout(() => {
      setWipingState('done');
      triggerHaptic('success');
      playSound('success');
      wipeTimer2Ref.current = window.setTimeout(() => {
        onWipeComplete();
      }, 550);
    }, 1150);
  };

  const handleRequestWipeAll = () => {
    triggerHaptic('warning');
    playSound('alert');
    if (pendingOtherOrderCount > 0) {
      setShowPendingWipeModal(true);
      return;
    }
    setConfirmWipe(true);
  };

  const handleDeleteCurrentOrder = () => {
    triggerHaptic('tap');
    playSound('toggle');
    onDeleteOrder(order.id);
  };

  const renderWipeAction = (compact = false) =>
    !confirmWipe ? (
      <button
        type="button"
        onClick={handleRequestWipeAll}
        className={`w-full ${
          compact ? 'min-h-[40px]' : 'min-h-[42px]'
        } px-3 rounded-xl bg-white hover:bg-[#F26B50]/15 border-[2px] border-[#141413] font-mono text-[11px] font-bold text-[#141413] flex items-center justify-center gap-1.5 transition-colors cursor-pointer`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-[#F26B50] shrink-0" />
        <span>
          {isCompleted
            ? 'Xóa sạch toàn bộ dữ liệu phiên'
            : 'Xóa sạch toàn bộ dữ liệu'}
        </span>
      </button>
    ) : (
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('tap');
            playSound('click');
            setConfirmWipe(false);
          }}
          className="min-h-[40px] rounded-xl bg-white border-[2px] border-[#141413] font-mono text-[11px] font-bold text-[#141413] cursor-pointer"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleConfirmWipe}
          className="min-h-[40px] rounded-xl bg-[#F26B50] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] font-mono text-[11px] font-bold text-[#141413] cursor-pointer"
        >
          Xác nhận xóa hết?
        </button>
      </div>
    );

  const renderCompletedCleanupActions = (compact = false) => (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDeleteCurrentOrder}
        className={`w-full ${
          compact ? 'min-h-[42px]' : 'min-h-[44px]'
        } px-3.5 rounded-xl bg-[#FFD166] hover:bg-[#95D5B2] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display text-[13.5px] font-extrabold text-[#141413] flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
      >
        <Trash2 className="w-4 h-4 shrink-0" />
        <span>Xóa riêng đơn này</span>
      </button>

      {renderWipeAction(compact)}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-[#FDF6E9] relative">
      {/* Sub-bar đơn hàng gọn */}
      <div className="shrink-0 px-3.5 md:px-6 py-2 md:py-2.5 bg-white border-b-[2.5px] border-[#141413] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('tap');
            onOpenOrderList();
          }}
          className="min-h-[32px] md:min-h-[36px] px-2.5 md:px-3 rounded-lg border-[2px] border-[#141413] bg-[#FFD166] hover:bg-[#95D5B2] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-[#141413] cursor-pointer transition-all"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Đơn của bạn ({orderCount})</span>
        </button>

        <span
          className={`px-2 py-0.5 rounded-md border-[1.5px] font-mono text-[10.5px] font-bold inline-flex items-center gap-1 ${
            isCompleted
              ? 'bg-[#95D5B2] border-[#141413] text-[#141413]'
              : 'bg-transparent border-transparent text-[#0F5C56]'
          }`}
        >
          {isCompleted && <Lock className="w-3 h-3 shrink-0" />}
          <span>
            #{order.orderCode} •{' '}
            {isCompleted ? 'COMPLETED' : 'ĐÃ ĐẶT'}
          </span>
        </span>
      </div>

      {/* Nội dung chính: Trạng thái Chờ nhận (OTP) vs Trạng thái Nhận hàng thành công (COMPLETED) */}
      <main className="animate-spring-pop flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-3.5 md:p-6">
        {!isCompleted ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-start">
            <div className="md:col-span-7 flex flex-col gap-3 md:gap-4 min-w-0">
              {/* Thẻ nhận hàng (Smart Locker OTP/QR vs Giao thả hỏa tốc không gặp mặt) */}
              <section
                data-tutorial-target="otp-pickup-box"
                aria-label={
                  order.deliveryMethod === 'locker'
                    ? 'Mã OTP mở tủ nhận hàng'
                    : 'Thông tin giao thả hỏa tốc 30 phút'
                }
                className="rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] overflow-hidden"
              >
                <div className="bg-[#0F5C56] text-[#FDF6E9] px-3.5 py-2.5 border-b-[2px] border-[#141413] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] font-bold text-[#FFD166]">
                      {order.deliveryMethod === 'locker'
                        ? 'TỦ SMART LOCKER 24/7'
                        : 'GIAO THẢ HỎA TỐC 30P'}
                    </p>
                    <h1 className="font-display text-[15.5px] font-extrabold leading-snug">
                      {order.deliveryMethod === 'locker'
                        ? 'Mã OTP mở tủ tự động'
                        : 'Giao thả kín đáo không gặp mặt'}
                    </h1>
                  </div>
                  {order.deliveryMethod === 'locker' ? (
                    <SmartLockerSvg className="w-9 h-9 shrink-0" />
                  ) : (
                    <DiscreetParcelSvg className="w-9 h-9 shrink-0" />
                  )}
                </div>

                <div className="p-3.5 space-y-3">
                  {order.deliveryMethod === 'locker' ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <p className="font-mono text-[10.5px] font-bold text-[#141413]/70">
                          NHẬP MÃ NÀY TẠI MÀN HÌNH TỦ
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="inline-block px-3.5 py-2 rounded-xl bg-[#FFD166] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413]">
                            <p className="font-mono text-[24px] font-bold tracking-wider text-[#141413] tabular-nums leading-none select-all">
                              {order.otpDigits}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleCopyOtp}
                            className={`min-h-[34px] px-2.5 rounded-xl border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-mono text-[10.5px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                              copyStatus === 'copied'
                                ? 'bg-[#95D5B2] text-[#141413]'
                                : copyStatus === 'failed'
                                  ? 'bg-[#F26B50]/25 text-[#141413]'
                                  : 'bg-[#FDF6E9] hover:bg-[#FFD166] text-[#141413]'
                            }`}
                          >
                            {copyStatus === 'copied' ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[2.6] text-[#0F5C56]" />
                                <span>Đã chép mã ✓</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 stroke-[2.4]" />
                                <span>Chép mã</span>
                              </>
                            )}
                          </button>
                        </div>

                        {copyStatus === 'failed' && (
                          <p
                            role="status"
                            className="font-mono text-[10.5px] font-bold text-[#B8321A] leading-snug"
                          >
                            Trình duyệt chặn tự chép — chạm giữ dãy số OTP ở trên để sao chép thủ công.
                          </p>
                        )}
                      </div>

                      <div
                        className="p-2 rounded-xl bg-[#FDF6E9] border-[2px] border-[#141413] shrink-0"
                        aria-label={`Mã QR mở tủ ${order.orderCode}`}
                      >
                        <QRCodeSVG
                          value={qrPayload}
                          size={70}
                          bgColor="#FDF6E9"
                          fgColor="#141413"
                          level="M"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="rounded-xl bg-[#FFD166]/35 border-[2px] border-[#141413] p-3 space-y-1">
                        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-[#0F5C56]">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>Điểm thả hàng đã chọn</span>
                        </div>
                        <p className="font-display text-[14.5px] font-extrabold text-[#141413] leading-snug break-words">
                          {order.courierAddressHint}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#95D5B2]/35 border-[2px] border-[#141413] p-3 flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0F5C56] border-[1.5px] border-[#141413] text-[#FFD166] flex items-center justify-center shrink-0 mt-0.5">
                          <Camera className="w-4 h-4 stroke-[2.4]" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <p className="font-mono text-[10.5px] font-extrabold uppercase text-[#0F5C56]">
                            Chờ tài xế chụp ảnh xác nhận không gặp mặt
                          </p>
                          <p className="text-[12px] font-medium text-[#141413] leading-snug">
                            Shipper sẽ đặt hộp carton trơn tại đúng điểm hẹn trên, chụp ảnh vị trí thả và rời đi — không gọi điện, không lộ tên thật hay SĐT.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t-[2px] border-dashed border-[#141413]/25 flex items-center justify-between gap-2 font-mono text-[11px] font-bold text-[#141413]">
                    <span className="flex items-center gap-1 text-[#0F5C56]">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      {order.readyEstimate}
                    </span>
                    <span className="tabular-nums">
                      Đã thanh toán {formatVnd(order.totalVnd)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmReceivedClick}
                    className="w-full min-h-[46px] px-4 rounded-xl bg-[#95D5B2] hover:bg-[#FFD166] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] font-display text-[14.5px] font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.6] text-[#0F5C56] shrink-0" />
                    <span>Đã nhận hàng</span>
                  </button>
                </div>
              </section>

              {/* Bản đồ vị trí tủ Smart Locker */}
              {order.deliveryMethod === 'locker' && (
                <SmartLockerLocationCard locker={order.lockerLocation} />
              )}

              {/* Dòng mở rộng gọn: Xem phiếu QR trong hộp */}
              <section className="rounded-xl bg-white border-[2px] border-[#141413] overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('toggle');
                    playSound('toggle');
                    setShowInsideBox((v) => !v);
                  }}
                  className="w-full min-h-[42px] px-3.5 py-2 flex items-center justify-between gap-2 text-left hover:bg-[#FFFDF8] transition-colors cursor-pointer"
                >
                  <span className="font-display text-[13px] font-bold text-[#141413]">
                    Xem phiếu kín trong hộp
                  </span>
                  {showInsideBox ? (
                    <ChevronUp className="w-4 h-4 text-[#141413] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#141413] shrink-0" />
                  )}
                </button>

                {showInsideBox && (
                  <div className="px-3.5 pb-3.5 pt-2.5 border-t-[2px] border-[#141413] bg-[#FDF6E9]">
                    <div className="rounded-xl bg-white border-[2px] border-dashed border-[#141413] p-3 space-y-1.5">
                      <p className="font-display text-[12.5px] font-bold text-[#141413]">
                        Phiếu đóng gói 0 danh tính
                      </p>
                      <p className="text-[11.5px] font-medium text-[#141413]/80 leading-snug">
                        Bên trong hộp carton nâu trơn chỉ có mã kiểm lô nhà thuốc và QR đánh giá sau khi nhận hàng — không in tên người nhận hay tên sản phẩm nhạy cảm.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* Ghi chú nhắc giữ thông tin */}
              <p className="flex items-center justify-center md:justify-start gap-1.5 font-mono text-[10.5px] font-semibold text-[#0F5C56] text-center md:text-left">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {order.deliveryMethod === 'locker'
                    ? 'Giữ mã OTP kín đáo • Xem lại bất cứ lúc nào ở mục Đơn của bạn'
                    : 'Theo dõi giao thả không gặp mặt • Xem lại bất cứ lúc nào ở mục Đơn của bạn'}
                </span>
              </p>
            </div>

            {/* Cột phải (Desktop): Hướng dẫn + Nút Về trang chủ / Xóa */}
            <aside className="md:col-span-5 md:sticky md:top-0 flex flex-col gap-3.5 min-w-0">
              {order.deliveryMethod === 'locker' ? (
                <section
                  aria-label="Hướng dẫn thao tác tại tủ Smart Locker"
                  className="rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-4 space-y-2.5"
                >
                  <p className="font-mono text-[10.5px] font-bold uppercase text-[#0F5C56]">
                    Thao tác tại tủ Smart Locker (30 giây)
                  </p>
                  <div className="space-y-2 text-[12px] font-medium text-[#141413]">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#FFD166] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <p className="leading-snug">
                        Đến đúng tủ{' '}
                        <strong className="font-mono">
                          {order.lockerLocation.lockerCode}
                        </strong>{' '}
                        và chạm nút <em>&ldquo;Nhận hàng&rdquo;</em> trên màn hình.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#95D5B2] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <p className="leading-snug">
                        Đưa mã QR ở trên vào đầu quét hoặc nhập 6 số OTP.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#FDF6E9] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <p className="leading-snug">
                        Ngăn tủ tự bật mở — lấy hộp carton trơn và đóng cửa tủ (0 tiếp xúc).
                      </p>
                    </div>
                  </div>
                </section>
              ) : (
                <section
                  aria-label="Quy trình giao thả hỏa tốc không gặp mặt"
                  className="rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-4 space-y-2.5"
                >
                  <p className="font-mono text-[10.5px] font-bold uppercase text-[#0F5C56]">
                    Quy trình giao thả 30 phút (0 gặp mặt)
                  </p>
                  <div className="space-y-2 text-[12px] font-medium text-[#141413]">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#FFD166] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <p className="leading-snug">
                        Nhà thuốc đóng hộp carton nâu trơn 2 lớp, chỉ dán mã đơn{' '}
                        <strong className="font-mono">#{order.orderCode}</strong>.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#95D5B2] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <p className="leading-snug">
                        Tài xế thả gói hàng tại điểm hẹn và chụp ảnh xác nhận qua app (không gọi điện).
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#FDF6E9] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <p className="leading-snug">
                        Sau khi ra lấy hộp xong, bấm nút{' '}
                        <strong>&ldquo;Đã nhận hàng&rdquo;</strong> để hoàn tất.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              <div className="hidden md:flex flex-col gap-2.5 rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-4">
                <button
                  type="button"
                  onClick={onSaveAndHome}
                  className="w-full min-h-[42px] px-4 rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Home className="w-4 h-4 shrink-0" />
                  <span>Lưu &amp; Về trang chủ</span>
                </button>

                {renderWipeAction(false)}
              </div>
            </aside>
          </div>
        ) : (
          /* TRẠNG THÁI COMPLETED: Nhận hàng thành công + Khung đánh giá ẩn danh */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 md:gap-6 items-start">
            <div className="md:col-span-7 flex flex-col gap-3.5 md:gap-4 min-w-0">
              {/* Thẻ xác nhận Nhận hàng thành công (Khóa trạng thái COMPLETED) */}
              <section
                aria-label="Xác nhận nhận hàng thành công"
                className="rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] overflow-hidden"
              >
                <div className="bg-[#0F5C56] text-[#FDF6E9] px-4 py-3.5 border-b-[2.5px] border-[#141413] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#95D5B2] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] flex items-center justify-center text-[#141413] shrink-0">
                      <PackageCheck className="w-6 h-6 stroke-[2.4]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FFD166]">
                        ĐƠN #{order.orderCode} • ĐÃ HOÀN TẤT
                      </p>
                      <h1 className="font-display text-[18px] md:text-[20px] font-extrabold leading-tight">
                        Nhận hàng thành công!
                      </h1>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-[#95D5B2] border-[2px] border-[#141413] font-mono text-[10px] font-extrabold text-[#141413] inline-flex items-center gap-1 shrink-0">
                    <Lock className="w-3 h-3 shrink-0" />
                    <span>COMPLETED</span>
                  </span>
                </div>

                <div className="p-3.5 md:p-4 space-y-2.5">
                  <div className="rounded-xl bg-[#95D5B2]/30 border-[2px] border-[#141413] px-3 py-2.5 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0F5C56] stroke-[2.6] shrink-0 mt-0.5" />
                    <p className="text-[12px] md:text-[12.5px] font-semibold text-[#141413] leading-snug">
                      Đã xác nhận nhận hàng kín đáo lúc{' '}
                      <span className="font-mono font-bold">
                        {order.completedAtLabel ?? order.createdAtLabel}
                      </span>
                      . Trạng thái đơn đã được khóa hoàn tất trong phiên.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#FDF6E9] border-[1.5px] border-[#141413]/35 p-3 space-y-1.5 text-[12px]">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-display font-extrabold text-[#141413]">
                        {order.itemsSummary}
                      </span>
                      <span className="font-mono font-bold text-[#0F5C56] tabular-nums shrink-0">
                        {formatVnd(order.totalVnd)}
                      </span>
                    </div>
                    <p className="text-[#141413]/80 font-medium flex items-start gap-1.5 leading-snug">
                      {order.deliveryMethod === 'locker' ? (
                        <MapPin className="w-3.5 h-3.5 text-[#0F5C56] shrink-0 mt-0.5" />
                      ) : (
                        <Truck className="w-3.5 h-3.5 text-[#0F5C56] shrink-0 mt-0.5" />
                      )}
                      <span>
                        {order.deliveryMethod === 'locker'
                          ? order.lockerLocation.name
                          : order.courierAddressHint}
                      </span>
                    </p>
                  </div>
                </div>
              </section>

              {/* Khung Đánh giá trải nghiệm ẩn danh */}
              <section
                aria-label="Đánh giá trải nghiệm ẩn danh"
                className="rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-4 space-y-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display text-[16px] md:text-[17px] font-extrabold text-[#141413] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#0F5C56] shrink-0" />
                      <span>Đánh giá trải nghiệm ẩn danh</span>
                    </h2>
                    <p className="text-[11.5px] font-medium text-[#141413]/75 mt-0.5">
                      Không tên, không tài khoản • Chỉ lưu tạm trong phiên để giúp bạn khác chọn size &amp; tủ chuẩn hơn.
                    </p>
                  </div>
                  {submittedReview && (
                    <span className="px-2.5 py-1 rounded-lg bg-[#95D5B2] border-[2px] border-[#141413] font-mono text-[10px] font-extrabold text-[#141413] shrink-0">
                      Đã ghi nhận đánh giá ẩn danh ✓
                    </span>
                  )}
                </div>

                {!submittedReview ? (
                  <form onSubmit={handleSendAnonymousReview} className="space-y-3.5">
                    {reviewTargets.length > 1 && (
                      <div className="space-y-1.5">
                        <p className="font-mono text-[10.5px] font-bold uppercase text-[#141413]/75">
                          Gắn đánh giá cho (tránh lặp sang món khác)
                        </p>
                        <div
                          role="radiogroup"
                          aria-label="Chọn sản phẩm gắn đánh giá"
                          className="flex flex-wrap gap-1.5"
                        >
                          <button
                            type="button"
                            role="radio"
                            aria-checked={
                              selectedReviewTargetId === ORDER_GENERAL_REVIEW_TARGET
                            }
                            onClick={() => {
                              triggerHaptic('toggle');
                              playSound('toggle');
                              setSelectedReviewTargetId(ORDER_GENERAL_REVIEW_TARGET);
                            }}
                            className={`min-h-[32px] px-2.5 rounded-xl border-[2px] border-[#141413] font-mono text-[10.5px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer ${
                              selectedReviewTargetId === ORDER_GENERAL_REVIEW_TARGET
                                ? 'bg-[#FFD166] text-[#141413] shadow-none translate-x-[1px] translate-y-[1px]'
                                : 'bg-[#FDF6E9] hover:bg-white text-[#141413] shadow-[2px_2px_0_#141413]'
                            }`}
                          >
                            {selectedReviewTargetId === ORDER_GENERAL_REVIEW_TARGET && (
                              <Check className="w-3 h-3 stroke-[3] text-[#0F5C56]" />
                            )}
                            <span>Đánh giá chung cho đơn hàng</span>
                          </button>

                          {reviewTargets.map((target) => {
                            const active = selectedReviewTargetId === target.id;
                            return (
                              <button
                                key={target.id}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => {
                                  triggerHaptic('toggle');
                                  playSound('toggle');
                                  setSelectedReviewTargetId(target.id);
                                }}
                                className={`min-h-[32px] px-2.5 rounded-xl border-[2px] border-[#141413] font-mono text-[10.5px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer ${
                                  active
                                    ? 'bg-[#95D5B2] text-[#141413] shadow-none translate-x-[1px] translate-y-[1px]'
                                    : 'bg-[#FDF6E9] hover:bg-white text-[#141413] shadow-[2px_2px_0_#141413]'
                                }`}
                              >
                                {active && (
                                  <Check className="w-3 h-3 stroke-[3] text-[#0F5C56]" />
                                )}
                                <span>{target.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Chọn số sao 1..5 */}
                    <div className="space-y-1.5">
                      <p className="font-mono text-[10.5px] font-bold uppercase text-[#141413]/75">
                        1. Mức độ hài lòng (1–5 sao)
                      </p>
                      <div
                        role="radiogroup"
                        aria-label="Chọn số sao đánh giá"
                        className="flex items-center gap-2"
                      >
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = star <= reviewRating;
                          return (
                            <button
                              key={star}
                              type="button"
                              role="radio"
                              aria-checked={reviewRating === star}
                              aria-label={`Chọn ${star} sao`}
                              onClick={() => {
                                triggerHaptic('tap');
                                playSound('toggle');
                                setReviewRating(star);
                              }}
                              className={`w-10 h-10 rounded-xl border-[2px] border-[#141413] flex items-center justify-center transition-all cursor-pointer ${
                                active
                                  ? 'bg-[#FFD166] shadow-[2px_2px_0_#141413]'
                                  : 'bg-[#FDF6E9] hover:bg-white'
                              }`}
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  active
                                    ? 'fill-[#141413] text-[#141413]'
                                    : 'text-[#141413]/35'
                                }`}
                              />
                            </button>
                          );
                        })}
                        {reviewRating > 0 && (
                          <span className="font-mono text-[12px] font-bold text-[#0F5C56] ml-1">
                            {reviewRating}/5 sao
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Các thẻ tag chọn nhanh */}
                    <div className="space-y-1.5">
                      <p className="font-mono text-[10.5px] font-bold uppercase text-[#141413]/75">
                        2. Điểm bạn ưng ý (chọn nhanh)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ANONYMOUS_REVIEW_TAGS.map((tag) => {
                          const selected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => handleToggleTag(tag)}
                              className={`min-h-[34px] px-3 rounded-xl border-[2px] border-[#141413] font-mono text-[11px] font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                                selected
                                  ? 'bg-[#95D5B2] text-[#141413] shadow-none translate-x-[1px] translate-y-[1px]'
                                  : 'bg-[#FDF6E9] hover:bg-white text-[#141413] shadow-[2px_2px_0_#141413]'
                              }`}
                            >
                              {selected && (
                                <Check className="w-3.5 h-3.5 text-[#0F5C56] stroke-[3]" />
                              )}
                              <span>{tag}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Nhận xét ngắn không bắt buộc */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="anonymous-review-comment"
                        className="block font-mono text-[10.5px] font-bold uppercase text-[#141413]/75"
                      >
                        3. Nhận xét ngắn (không bắt buộc)
                      </label>
                      <textarea
                        id="anonymous-review-comment"
                        rows={2}
                        maxLength={180}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="VD: Tủ lấy siêu nhanh, hộp carton trơn hoàn toàn..."
                        className="w-full rounded-xl bg-[#FDF6E9] focus:bg-white border-[2px] border-[#141413] px-3 py-2 text-[12.5px] font-medium text-[#141413] placeholder:text-[#141413]/45 focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewRating < 1}
                      className="w-full min-h-[46px] px-4 rounded-xl bg-[#FFD166] hover:bg-[#95D5B2] disabled:bg-zinc-200 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display text-[14px] font-extrabold text-[#141413] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.4]" />
                      <span>
                        {reviewRating < 1
                          ? 'Chọn số sao (1–5) để gửi đánh giá'
                          : 'Gửi đánh giá ẩn danh'}
                      </span>
                    </button>
                  </form>
                ) : (
                  <div className="rounded-xl bg-[#FDF6E9] border-[2px] border-[#141413] p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= submittedReview.rating
                                ? 'fill-[#FFD166] text-[#141413]'
                                : 'text-zinc-300'
                            }`}
                          />
                        ))}
                        <span className="font-mono text-[12px] font-bold text-[#141413] ml-1">
                          {submittedReview.rating}/5 sao
                        </span>
                      </div>
                      <span className="font-mono text-[10.5px] font-bold text-[#0F5C56]">
                        {submittedReview.submittedAtLabel}
                      </span>
                    </div>

                    {submittedReview.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {submittedReview.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-[#95D5B2] border border-[#141413] font-mono text-[10px] font-bold text-[#141413]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {submittedReview.comment && (
                      <p className="text-[12.5px] font-medium text-[#141413] leading-snug">
                        &ldquo;{submittedReview.comment}&rdquo;
                      </p>
                    )}

                    {submittedReview.targetProductLabel && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#141413] font-mono text-[10px] font-bold text-[#141413]">
                        <span>
                          {submittedReview.targetProductId === ORDER_GENERAL_REVIEW_TARGET
                            ? 'Phạm vi: Đánh giá chung cho đơn hàng'
                            : `Sản phẩm: ${submittedReview.targetProductLabel}`}
                        </span>
                      </div>
                    )}

                    <p className="font-mono text-[10.5px] font-semibold text-[#0F5C56]">
                      {submittedReview.targetProductId === ORDER_GENERAL_REVIEW_TARGET
                        ? 'Đã ghi nhận đánh giá chung cho đơn hàng trong phiên này.'
                        : 'Đã lưu vào danh sách đánh giá sản phẩm đã chọn trong phiên này.'}
                    </p>
                  </div>
                )}
              </section>

              {/* Mobile: Tách rõ Xóa riêng đơn này vs Xóa sạch toàn bộ dữ liệu phiên */}
              <section
                aria-label="Quản lý dấu vết phiên trên di động"
                className="md:hidden rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-3.5 space-y-2.5"
              >
                {renderCompletedCleanupActions(true)}
                <button
                  type="button"
                  onClick={onSaveAndHome}
                  className="w-full min-h-[42px] px-4 rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Home className="w-4 h-4 shrink-0" />
                  <span>Về trang chủ</span>
                </button>
              </section>
            </div>

            {/* Cột phải (Desktop): Xóa riêng đơn vs Xóa sạch phiên & Về trang chủ */}
            <aside className="hidden md:flex md:col-span-5 md:sticky md:top-0 flex-col gap-3.5 min-w-0">
              <div className="rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-4 space-y-3">
                <div className="space-y-1">
                  <p className="font-mono text-[10.5px] font-bold uppercase text-[#0F5C56]">
                    BẢO MẬT SAU KHI NHẬN HÀNG
                  </p>
                  <p className="text-[12.5px] font-medium text-[#141413]/85 leading-snug">
                    {pendingOtherOrderCount > 0
                      ? `Bạn vẫn còn ${pendingOtherOrderCount} đơn đang chờ lấy. Hãy chọn "Xóa riêng đơn này" nếu muốn giữ nguyên mã OTP của đơn còn lại.`
                      : 'Đơn hàng đã hoàn tất vĩnh viễn. Bạn có thể xóa riêng đơn này hoặc xóa sạch toàn bộ dữ liệu phiên.'}
                  </p>
                </div>

                {renderCompletedCleanupActions(false)}

                <button
                  type="button"
                  onClick={onSaveAndHome}
                  className="w-full min-h-[44px] px-4 rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display text-[14px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Home className="w-4 h-4 shrink-0" />
                  <span>Về trang chủ</span>
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Mobile Footer khi đang chờ lấy hàng (ready) */}
      {!isCompleted && (
        <footer className="md:hidden shrink-0 bg-[#FDF6E9] border-t-[2.5px] border-[#141413] px-3.5 py-2.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSaveAndHome}
              className="min-h-[38px] px-2.5 rounded-xl bg-[#0F5C56] border-[2px] border-[#141413] text-[#FDF6E9] font-display text-[12px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 shrink-0" />
              <span>Về trang chủ</span>
            </button>
            {!confirmWipe ? (
              <button
                type="button"
                onClick={handleRequestWipeAll}
                className="min-h-[38px] px-2.5 rounded-xl bg-white border-[2px] border-[#141413] font-mono text-[10.5px] font-bold text-[#141413] flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#F26B50] shrink-0" />
                <span>Xóa dữ liệu</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmWipe}
                className="min-h-[38px] px-2.5 rounded-xl bg-[#F26B50] border-[2px] border-[#141413] font-mono text-[10.5px] font-bold text-[#141413] cursor-pointer"
              >
                Xác nhận xóa?
              </button>
            )}
          </div>
        </footer>
      )}

      {/* Hộp thoại cảnh báo khi bấm Xóa sạch toàn bộ dữ liệu phiên nhưng vẫn còn đơn ready khác */}
      {showPendingWipeModal && wipingState === 'idle' && (
        <div
          className="absolute inset-0 z-50 bg-[#141413]/75 p-4 flex items-center justify-center animate-spring-pop"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="pending-wipe-warning-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-[#FDF6E9] border-[3px] border-[#141413] shadow-[6px_6px_0_#141413] overflow-hidden">
            <div className="bg-[#F26B50] border-b-[2.5px] border-[#141413] px-4 py-3 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFD166] border-[2px] border-[#141413] flex items-center justify-center text-[#141413] shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-extrabold uppercase text-[#141413]">
                  CẢNH BÁO MẤT MÃ OTP ĐƠN CHỜ LẤY
                </p>
                <h2
                  id="pending-wipe-warning-title"
                  className="font-display text-[15.5px] font-extrabold text-[#141413] leading-snug"
                >
                  Còn {pendingOtherOrderCount} đơn hàng chưa nhận ở tủ!
                </h2>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-[12.5px] font-semibold text-[#141413] leading-snug">
                Nếu chọn <strong>Xóa sạch toàn bộ dữ liệu phiên</strong>, mã OTP và thông tin nhận của{' '}
                <strong className="text-[#B8321A]">
                  {pendingOtherOrderCount} đơn đang ở trạng thái chờ lấy
                </strong>{' '}
                cũng sẽ bị xóa vĩnh viễn không thể khôi phục.
              </p>

              <div className="rounded-xl bg-[#FFD166]/40 border-[1.5px] border-[#141413] px-3 py-2 text-[11.5px] font-medium text-[#141413]">
                Mẹo: Chọn <strong>&ldquo;Giữ lại đơn chờ lấy&rdquo;</strong> rồi bấm{' '}
                <strong>&ldquo;Xóa riêng đơn này&rdquo;</strong> để chỉ xóa đơn đã hoàn tất.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('tap');
                    playSound('click');
                    setShowPendingWipeModal(false);
                  }}
                  className="min-h-[42px] px-3 rounded-xl bg-white hover:bg-[#95D5B2] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] font-display text-[12.5px] font-bold text-[#141413] cursor-pointer transition-colors"
                >
                  Giữ lại đơn chờ lấy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmWipe}
                  className="min-h-[42px] px-3 rounded-xl bg-[#F26B50] hover:bg-[#E95436] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] font-display text-[12.5px] font-extrabold text-[#141413] cursor-pointer transition-colors"
                >
                  Vẫn xóa sạch tất cả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Màn hình quét xóa sạch toàn bộ dấu vết */}
      {wipingState !== 'idle' && (
        <div
          className="absolute inset-0 z-50 bg-[#141413] text-[#FDF6E9] flex flex-col items-center justify-center p-6 text-center animate-spring-pop"
          role="dialog"
          aria-modal="true"
          aria-label="Đang xóa toàn bộ dữ liệu"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#FFD166] border-[2.5px] border-[#FDF6E9] flex items-center justify-center mb-4">
            {wipingState === 'erasing' ? (
              <Trash2 className="w-8 h-8 text-[#141413] animate-bounce" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-[#0F5C56]" />
            )}
          </div>

          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#95D5B2]">
            {wipingState === 'erasing'
              ? 'ĐANG TỰ XÓA PHIÊN'
              : 'SẠCH HOÀN TOÀN 100%'}
          </p>
          <h2 className="font-display text-[22px] font-extrabold text-[#FDF6E9] mt-1">
            {wipingState === 'erasing'
              ? 'ĐANG XÓA DỮ LIỆU...'
              : 'ĐÃ XÓA SẠCH DẤU VẾT'}
          </h2>
          <p className="text-[12.5px] text-zinc-300 mt-2 max-w-[260px]">
            {wipingState === 'erasing'
              ? 'Đang xóa danh sách đơn, túi tạm, vị trí tủ & ghi chú...'
              : 'Quay về trang chủ sạch ngay bây giờ.'}
          </p>

          <div className="mt-5 w-full max-w-[240px] h-2.5 bg-[#262624] border-[2px] border-[#FDF6E9] rounded-full overflow-hidden">
            <div
              className={`h-full bg-[#FFD166] transition-all duration-1000 ${
                wipingState === 'erasing' ? 'w-3/4' : 'w-full'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
