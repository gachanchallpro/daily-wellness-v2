import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronsRight,
  PackageCheck,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';

interface DiscreetLabelSliderCardProps {
  orderCode?: string;
  compact?: boolean;
  tutorialTarget?: string;
}

export const DiscreetLabelSliderCard: React.FC<
  DiscreetLabelSliderCardProps
> = ({ orderCode = 'DW-8822', compact = false, tutorialTarget }) => {
  const { playSound } = useSoundFeedback();
  const [revealProgress, setRevealProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const lastStepBucketRef = useRef<number>(0);
  const unlockedRef = useRef<boolean>(false);

  const isRevealed = revealProgress >= 0.85;
  const pct = Math.round(revealProgress * 100);
  const displayCode = orderCode.replace(/^#/, '');

  const applyProgress = (nextVal: number) => {
    const clamped = Math.max(0, Math.min(1, nextVal));
    setRevealProgress(clamped);

    const bucket = Math.floor(clamped * 5);
    if (bucket !== lastStepBucketRef.current) {
      lastStepBucketRef.current = bucket;
      playSound('slide');
    }

    if (clamped >= 0.9 && !unlockedRef.current) {
      unlockedRef.current = true;
      triggerHaptic('success');
      playSound('success');
    } else if (clamped < 0.25 && unlockedRef.current) {
      unlockedRef.current = false;
      triggerHaptic('toggle');
      playSound('toggle');
    }
  };

  const updateProgressFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const thumbWidth = 48;
    const usableWidth = Math.max(1, rect.width - thumbWidth);
    const raw = (clientX - rect.left - thumbWidth / 2) / usableWidth;
    applyProgress(raw);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    triggerHaptic('tap');
    updateProgressFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateProgressFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (revealProgress >= 0.85) {
      setRevealProgress(1);
    } else if (revealProgress <= 0.15) {
      setRevealProgress(0);
    }
  };

  const handleReset = () => {
    triggerHaptic('toggle');
    playSound('toggle');
    unlockedRef.current = false;
    lastStepBucketRef.current = 0;
    setRevealProgress(0);
  };

  return (
    <section
      data-tutorial-target={tutorialTarget}
      aria-label="Kéo thanh trượt so sánh tem sàn TMĐT và tem ẩn danh Daily Wellness"
      className={`rounded-xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] ${
        compact ? 'p-3 space-y-2.5' : 'p-3.5 space-y-3'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-[#141413]">
          Đối chiếu tem bọc kín (0 tên shop, 0 tên món)
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#0F5C56] tabular-nums">
            {pct}%
          </span>
          {revealProgress > 0 && (
            <button
              type="button"
              onClick={handleReset}
              aria-label="Quay lại tem sàn TMĐT"
              className="w-6 h-6 rounded border-[1.5px] border-[#141413] bg-[#FDF6E9] hover:bg-[#FFD166] flex items-center justify-center cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Thẻ so sánh 2 lớp: Sàn TMĐT vs Daily Wellness */}
      <div className="relative grid rounded-xl border-[2.5px] border-[#141413] bg-[#141413] overflow-hidden">
        {/* Lớp dưới (Mặc định): TEM SÀN TMĐT */}
        <div
          className={`[grid-area:1/1] ${
            compact ? 'p-3 space-y-2' : 'p-3.5 space-y-2.5'
          } bg-[#141413] text-[#FDF6E9]`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-[12px] md:text-[12.5px] font-extrabold uppercase tracking-tight text-[#FFD166] flex items-center gap-1.5 whitespace-nowrap">
              <AlertTriangle className="w-4 h-4 text-[#F26B50] shrink-0" />
              <span>TEM SÀN TMĐT</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-[#F26B50] text-[#141413] font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
              DỄ LỘ
            </span>
          </div>

          <ul className="space-y-1.5">
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-[#F26B50] shrink-0 mt-[2px]" />
              <span className="font-sans text-[12px] md:text-[12.5px] font-medium leading-snug text-[#FDF6E9]/90">
                In <strong className="font-bold text-white">Tên shop, Tên thật &amp; SĐT</strong> lên hộp
              </span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-[#F26B50] shrink-0 mt-[2px]" />
              <span className="font-sans text-[12px] md:text-[12.5px] font-medium leading-snug text-[#FDF6E9]/90">
                Hiện rõ <strong className="font-bold text-white">tên sản phẩm nhạy cảm</strong> trên phiếu giao
              </span>
            </li>
          </ul>
        </div>

        {/* Lớp trên (Khi kéo mở): TEM DAILY WELLNESS */}
        <div
          className={`[grid-area:1/1] bg-[#D8F3DC] text-[#141413] ${
            compact ? 'p-3 space-y-2' : 'p-3.5 space-y-2.5'
          } transition-[clip-path] duration-75 ease-out pointer-events-none`}
          style={{
            clipPath: `inset(0 ${100 - pct}% 0 0)`,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-[12px] md:text-[12.5px] font-extrabold uppercase tracking-tight text-[#0F5C56] flex items-center gap-1.5 whitespace-nowrap">
              <PackageCheck className="w-4 h-4 text-[#0F5C56] shrink-0" />
              <span>TEM DAILY WELLNESS</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-[#0F5C56] text-[#FFD166] font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
              KÍN 100%
            </span>
          </div>

          <ul className="space-y-1.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0F5C56] shrink-0 mt-[2px]" />
              <span className="font-sans text-[12px] md:text-[12.5px] font-medium leading-snug text-[#141413]">
                Chỉ in <strong className="font-bold font-mono">#{displayCode}</strong> —{' '}
                <strong className="font-bold">0 tên shop, 0 tên thật, 0 SĐT</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0F5C56] shrink-0 mt-[2px]" />
              <span className="font-sans text-[12px] md:text-[12.5px] font-medium leading-snug text-[#141413]">
                Hộp carton nâu trơn 2 lớp —{' '}
                <strong className="font-bold">0 tên sản phẩm nhạy cảm</strong>
              </span>
            </li>
          </ul>
        </div>

        {pct > 2 && pct < 98 && (
          <div
            className="absolute top-0 bottom-0 w-[3px] bg-[#FFD166] shadow-[0_0_0_1px_#141413] pointer-events-none"
            style={{ left: `${pct}%` }}
          />
        )}
      </div>

      {/* Thanh trượt tương tác + input range ẩn phục vụ accessibility */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative h-11 rounded-xl bg-[#FDF6E9] border-[2.5px] border-[#141413] select-none touch-none cursor-grab active:cursor-grabbing overflow-hidden flex items-center"
      >
        <input
          type="range"
          min={0}
          max={100}
          value={pct}
          aria-label="Kéo thanh trượt so sánh tem sàn TMĐT và tem ẩn danh Daily Wellness"
          onChange={(e) => applyProgress(Number(e.target.value) / 100)}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute inset-0 z-20 w-full h-full opacity-0 cursor-grab active:cursor-grabbing"
        />

        <div
          className="absolute inset-y-0 left-0 bg-[#D8F3DC] pointer-events-none"
          style={{ width: `${pct}%` }}
        />

        <span
          className={`relative z-10 w-full font-sans text-[11.5px] font-bold whitespace-nowrap pointer-events-none ${
            isRevealed
              ? 'pr-13 pl-3 text-right text-[#0F5C56]'
              : 'pl-13 pr-3 text-left text-[#141413]/85'
          }`}
        >
          {isRevealed
            ? '✓ Đã mở tem kín · Kéo trái xem lại'
            : 'Kéo sang phải so sánh tem kín →'}
        </span>

        <div
          className={`absolute top-1 bottom-1 w-10 rounded-lg border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] flex items-center justify-center pointer-events-none transition-colors ${
            isRevealed
              ? 'bg-[#0F5C56] text-[#FFD166]'
              : 'bg-[#FFD166] text-[#141413]'
          }`}
          style={{
            left: `calc(${revealProgress * 100}% - ${revealProgress * 48}px + 4px)`,
          }}
        >
          {isRevealed ? (
            <PackageCheck className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <ChevronsRight className="w-4.5 h-4.5 stroke-[2.6]" />
          )}
        </div>
      </div>
    </section>
  );
};
