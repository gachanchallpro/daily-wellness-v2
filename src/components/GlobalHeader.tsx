import React from 'react';
import {
  ShieldCheck,
  EyeOff,
  ShoppingBag,
  Trash2,
  Volume2,
  VolumeX,
  HelpCircle,
} from 'lucide-react';
import { useSoundFeedback } from '../hooks/useSoundFeedback';
import { triggerHaptic } from '../utils/haptics';

interface GlobalHeaderProps {
  cartCount: number;
  onPanicHide: () => void;
  onOpenCart: () => void;
  onOpenTutorial: () => void;
  onWipeSession: () => void;
  showCartButton?: boolean;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  cartCount,
  onPanicHide,
  onOpenCart,
  onOpenTutorial,
  onWipeSession,
  showCartButton = true,
}) => {
  const { soundEnabled, toggleSound } = useSoundFeedback();

  return (
    <header className="relative z-20 shrink-0 bg-[#FDF6E9] border-b-[2.5px] border-[#141413] px-2.5 sm:px-3.5 md:px-6 py-2 md:py-3 flex items-center justify-between gap-1.5 md:gap-4 min-w-0">
      {/* Trái: Biểu tượng khiên + Daily Wellness */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 min-w-0">
        <div className="w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] md:w-9 md:h-9 rounded-lg md:rounded-xl bg-[#0F5C56] border-[2px] border-[#141413] flex items-center justify-center text-[#FFD166] shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 stroke-[2.4]" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-[12px] sm:text-[14px] md:text-[16px] font-extrabold tracking-tight text-[#141413] leading-none whitespace-nowrap">
            Daily Wellness
          </p>
          <p className="hidden md:block font-mono text-[10px] font-bold text-[#0F5C56] tracking-wide mt-0.5 whitespace-nowrap">
            100% ẨN DANH • KHÔNG LƯU VẾT
          </p>
        </div>
      </div>

      {/* Phải: Nút Hướng dẫn (?) + Âm thanh + Túi hàng + Xóa phiên + Nút ẨN NHANH nổi bật chống bấm trượt */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
        <button
          type="button"
          data-tutorial-target="tutorial-help-btn"
          onClick={() => {
            triggerHaptic('tap');
            onOpenTutorial();
          }}
          aria-label="Xem lại hướng dẫn sử dụng"
          title="Xem lại hướng dẫn sử dụng"
          className="min-w-[30px] min-h-[32px] sm:min-w-[34px] sm:min-h-[34px] md:min-w-[40px] md:min-h-[40px] rounded-xl border-[2px] md:border-[2.5px] border-[#141413] bg-white hover:bg-[#FFD166] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] flex items-center justify-center transition-all cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.4]" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('toggle');
            toggleSound();
          }}
          aria-label={soundEnabled ? 'Tắt âm thanh thao tác' : 'Bật âm thanh thao tác'}
          title={soundEnabled ? 'Âm thanh: Đang bật' : 'Âm thanh: Đang tắt (Im lặng)'}
          className={`min-w-[30px] min-h-[32px] sm:min-w-[34px] sm:min-h-[34px] md:min-w-[40px] md:min-h-[40px] rounded-xl border-[2px] md:border-[2.5px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-[#95D5B2] text-[#141413]'
              : 'bg-white text-[#141413]/70 hover:text-[#141413]'
          }`}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.4]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.4]" />
          )}
        </button>

        {showCartButton && (
          <button
            type="button"
            data-tutorial-target="header-cart-btn"
            onClick={() => {
              triggerHaptic('tap');
              onOpenCart();
            }}
            aria-label={`Mở túi hàng (${cartCount} sản phẩm)`}
            className="relative min-w-[30px] min-h-[32px] sm:min-w-[34px] sm:min-h-[34px] md:min-w-[40px] md:min-h-[40px] rounded-xl border-[2px] md:border-[2.5px] border-[#141413] bg-white hover:bg-[#FDF6E9] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] flex items-center justify-center transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.4]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[19px] h-[19px] px-1 rounded-full bg-[#FFD166] border-[2px] border-[#141413] text-[#141413] font-mono text-[10px] font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onWipeSession}
          aria-label="Xóa dấu vết phiên"
          title="Xóa sạch toàn bộ dữ liệu phiên (túi, ghi chú, tủ & PIN két)"
          className="min-w-[30px] min-h-[32px] sm:min-w-[34px] sm:min-h-[34px] md:min-w-[40px] md:min-h-[40px] lg:px-2.5 rounded-xl border-[2px] md:border-[2.5px] border-[#141413] bg-white hover:bg-[#F26B50]/25 shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F26B50] stroke-[2.4] shrink-0" aria-hidden="true" />
          <span className="hidden lg:inline whitespace-nowrap">Xóa dấu vết phiên</span>
        </button>

        <div
          aria-hidden="true"
          className="hidden md:block w-[2px] h-7 bg-[#141413]/20 mx-0.5 rounded-full"
        />

        <button
          type="button"
          data-tutorial-target="panic-hide-btn"
          onClick={onPanicHide}
          aria-label="Ẩn nhanh sang màn hình ngụy trang Daily Water (Phím tắt Esc)"
          title="Nhấn hoặc bấm phím Esc để chuyển ngay sang màn hình ngụy trang Daily Water"
          className="ml-0.5 md:ml-0 min-h-[38px] sm:min-h-[40px] md:min-h-[46px] px-2.5 sm:px-3.5 md:px-4.5 rounded-xl bg-[#F26B50] hover:bg-[#E95436] border-[2.5px] md:border-[3px] border-[#141413] shadow-[3px_3px_0_#141413] md:shadow-[4px_4px_0_#141413] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none text-[#141413] font-mono text-[11px] sm:text-[11.5px] md:text-[13px] font-extrabold uppercase tracking-tight flex items-center gap-1 sm:gap-1.5 md:gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 stroke-[2.6] shrink-0" aria-hidden="true" />
          <span>ẨN NHANH</span>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#141413] text-[#FFD166] font-mono text-[10px] font-bold leading-none tracking-normal">
            [ESC]
          </kbd>
        </button>
      </div>
    </header>
  );
};
