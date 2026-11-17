import React from 'react';
import { ShieldCheck, Truck, X } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';
import { DiscreetLabelSliderCard } from './DiscreetLabelSliderCard';

interface MaskedCourierTutorialOverlayProps {
  sampleProductName?: string;
  orderCode?: string;
  onClose: () => void;
}

export const MaskedCourierTutorialOverlay: React.FC<
  MaskedCourierTutorialOverlayProps
> = ({ orderCode = 'DW-8822', onClose }) => {
  const { playSound } = useSoundFeedback();
  const displayCode = orderCode.replace(/^#/, '');

  return (
    <div
      className="absolute inset-0 z-50 bg-[#141413]/75 p-4 flex items-center justify-center animate-spring-pop"
      role="dialog"
      aria-modal="true"
      aria-label="So sánh tem hộp với sàn TMĐT"
    >
      <div className="w-full max-w-lg max-h-full bg-[#FDF6E9] border-[3px] border-[#141413] rounded-2xl shadow-[6px_6px_0_#141413] flex flex-col overflow-hidden min-w-0">
        {/* Top Zine Header */}
        <header className="shrink-0 bg-[#FFD166] border-b-[2.5px] border-[#141413] px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0F5C56] border-[2px] border-[#141413] flex items-center justify-center text-[#FFD166] shrink-0">
              <Truck className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#141413]/75 leading-none">
                SO SÁNH TEM VẬN CHUYỂN
              </p>
              <h2 className="font-display text-[14.5px] font-extrabold text-[#141413] leading-snug mt-0.5 break-words">
                Khác gì so với đặt trên Shopee/Lazada?
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap');
              playSound('click');
              onClose();
            }}
            aria-label="Đóng so sánh tem hộp"
            className="w-8 h-8 mr-0.5 rounded-lg bg-white border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center text-[#141413] cursor-pointer shrink-0 transition-all"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-4 space-y-3.5">
          <DiscreetLabelSliderCard orderCode={displayCode} />

          <section className="rounded-xl bg-white border-[2px] border-[#141413] p-3.5 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-[#FFD166] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <p className="font-sans text-[13px] font-medium text-[#141413] leading-relaxed">
                <strong className="font-bold">Không tên thật &amp; SĐT:</strong>{' '}
                Tem chỉ in mã đơn{' '}
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                  #{displayCode}
                </span>{' '}
                và biệt danh nhận hàng.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-[#95D5B2] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <p className="font-sans text-[13px] font-medium text-[#141413] leading-relaxed flex-1">
                <strong className="font-bold">Không gọi điện làm phiền:</strong>{' '}
                Tài xế thả đúng điểm hẹn, chụp ảnh xác nhận qua app và rời đi.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-[#F26B50]/60 border-[1.5px] border-[#141413] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <p className="font-sans text-[13px] font-medium text-[#141413] leading-relaxed">
                <strong className="font-bold">Hộp nâu trơn 2 lớp:</strong>{' '}
                Xuất kho trực tiếp từ nhà thuốc gần bạn trong 30 phút, không logo.
              </p>
            </div>
          </section>
        </div>

        <footer className="shrink-0 bg-[#FDF6E9] border-t-[2.5px] border-[#141413] p-3.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('success');
              playSound('success');
              onClose();
            }}
            className="w-full min-h-[44px] px-4 rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#FFD166] shrink-0" />
            <span>Đã hiểu • Đóng so sánh</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
