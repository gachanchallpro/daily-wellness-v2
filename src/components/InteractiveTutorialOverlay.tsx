import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Check, EyeOff, Sparkles, X } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';
import {
  TUTORIAL_STEPS,
  TUTORIAL_STEP_COUNT,
  computeTutorialOverlayLayout,
} from '../utils/tutorialLogic';
import { ScreenId } from '../types';

export { TUTORIAL_STEP_COUNT };

interface CutoutRect {
  left: number;
  top: number;
  width: number;
  height: number;
  borderRadius: number;
  containerW: number;
  containerH: number;
}

interface InteractiveTutorialOverlayProps {
  stepIndex: number;
  panicDecoyActive: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export const InteractiveTutorialOverlay: React.FC<
  InteractiveTutorialOverlayProps
> = ({
  stepIndex,
  panicDecoyActive,
  containerRef,
  onPrevStep,
  onNextStep,
  onSkip,
  onComplete,
}) => {
  const { playSound } = useSoundFeedback();
  const [cutout, setCutout] = useState<CutoutRect | null>(null);
  const [tooltipHeight, setTooltipHeight] = useState<number>(200);
  const [wipeTick, setWipeTick] = useState<number>(0);

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const prevScreenRef = useRef<ScreenId>(TUTORIAL_STEPS[0].screen);
  const scrolledTargetKeyRef = useRef<string>('');

  const safeStepIndex = Math.max(
    0,
    Math.min(TUTORIAL_STEPS.length - 1, stepIndex)
  );
  const currentStep = TUTORIAL_STEPS[safeStepIndex];
  const isFirstStep = safeStepIndex === 0;
  const isLastStep = safeStepIndex === TUTORIAL_STEPS.length - 1;
  const isPanicPreviewOnLastStep = isLastStep && panicDecoyActive;

  // Trigger fast 280ms Zine transition ribbon when crossing between screens
  useEffect(() => {
    if (prevScreenRef.current !== currentStep.screen) {
      prevScreenRef.current = currentStep.screen;
      setWipeTick((n) => n + 1);
      const timerId = window.setTimeout(() => {
        setWipeTick(0);
      }, 300);
      return () => window.clearTimeout(timerId);
    }
  }, [currentStep.screen]);

  const findVisibleTarget = useCallback(
    (containerEl: HTMLElement, targetName: string): HTMLElement | null => {
      const candidates = containerEl.querySelectorAll<HTMLElement>(
        `[data-tutorial-target="${targetName}"]`
      );
      for (const el of candidates) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return el;
        }
      }
      return null;
    },
    []
  );

  const measureTarget = useCallback(
    (allowScroll = false) => {
      if (isPanicPreviewOnLastStep) {
        setCutout(null);
        return;
      }

      const containerEl = containerRef.current;
      if (!containerEl) {
        setCutout(null);
        return;
      }

      const targetEl = findVisibleTarget(containerEl, currentStep.target);
      if (!targetEl) {
        setCutout(null);
        return;
      }

      const stepKey = `${safeStepIndex}:${currentStep.target}`;
      if (allowScroll && scrolledTargetKeyRef.current !== stepKey) {
        scrolledTargetKeyRef.current = stepKey;
        const containerRect = containerEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        if (
          targetRect.top < containerRect.top + 64 ||
          targetRect.bottom > containerRect.bottom - 32
        ) {
          targetEl.scrollIntoView({
            behavior: 'auto',
            block:
              targetRect.height > containerRect.height * 0.45
                ? 'start'
                : 'center',
            inline: 'nearest',
          });
        }
      }

      const containerRect = containerEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const pad = 6;
      const minTop = currentStep.target === 'panic-hide-btn' ? 4 : 60;

      const rawLeft = targetRect.left - containerRect.left - pad;
      const rawTop = targetRect.top - containerRect.top - pad;
      const rawWidth = targetRect.width + pad * 2;
      const rawHeight = targetRect.height + pad * 2;

      const left = Math.max(4, rawLeft);
      const top = Math.max(minTop, rawTop);
      const width = Math.min(rawWidth, containerRect.width - left - 4);
      const height = Math.min(rawHeight, containerRect.height - top - 4);

      setCutout({
        left,
        top,
        width: Math.max(24, width),
        height: Math.max(24, height),
        borderRadius: currentStep.cutoutRadius,
        containerW: containerRect.width,
        containerH: containerRect.height,
      });
    },
    [
      containerRef,
      currentStep.cutoutRadius,
      currentStep.target,
      findVisibleTarget,
      isPanicPreviewOnLastStep,
      safeStepIndex,
    ]
  );

  useLayoutEffect(() => {
    measureTarget(true);

    const t1 = window.setTimeout(() => measureTarget(false), 60);
    const t2 = window.setTimeout(() => measureTarget(false), 180);
    const t3 = window.setTimeout(() => measureTarget(false), 360);
    const t4 = window.setTimeout(() => measureTarget(false), 520);

    const containerEl = containerRef.current;
    const handleMeasure = () => measureTarget(false);

    window.addEventListener('resize', handleMeasure);
    containerEl?.addEventListener('scroll', handleMeasure, true);

    const ro =
      typeof ResizeObserver !== 'undefined' && containerEl
        ? new ResizeObserver(handleMeasure)
        : null;
    if (ro && containerEl) {
      ro.observe(containerEl);
    }

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.removeEventListener('resize', handleMeasure);
      containerEl?.removeEventListener('scroll', handleMeasure, true);
      ro?.disconnect();
    };
  }, [containerRef, measureTarget, safeStepIndex]);

  useLayoutEffect(() => {
    const el = tooltipRef.current;
    if (!el) return;
    const nextH = Math.ceil(el.getBoundingClientRect().height);
    if (nextH > 80 && Math.abs(nextH - tooltipHeight) > 2) {
      setTooltipHeight(nextH);
    }
  }, [safeStepIndex, cutout, tooltipHeight]);

  const handlePrev = () => {
    if (isFirstStep) return;
    triggerHaptic('tap');
    playSound('click');
    onPrevStep();
  };

  const handleNext = () => {
    if (isLastStep) {
      triggerHaptic('success');
      playSound('success');
      onComplete();
      return;
    }
    triggerHaptic('tap');
    playSound('transition');
    onNextStep();
  };

  const handleSkip = () => {
    triggerHaptic('tap');
    playSound('click');
    onSkip();
  };

  // Trạng thái vừa test nút ẨN NHANH thành công ở Bước 6
  if (isPanicPreviewOnLastStep) {
    return (
      <div
        className="absolute inset-0 z-50 bg-[#0F172A]/72 p-4 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Hoàn tất hướng dẫn Daily Wellness"
      >
        <div className="animate-kinetic-tooltip w-full max-w-[340px] rounded-2xl bg-[#FDF6E9] border-[2.5px] border-[#141413] shadow-[5px_5px_0_#141413] p-4 space-y-3">
          {/* Thanh tiến độ 6 đoạn */}
          <div className="grid grid-cols-6 gap-1.5" aria-hidden="true">
            {TUTORIAL_STEPS.map((s) => (
              <span
                key={s.id}
                className="h-1.5 rounded-full bg-[#0F5C56] border border-[#141413]"
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#95D5B2] border-[1.5px] border-[#141413] font-mono text-[10px] font-bold text-[#141413]">
              <EyeOff className="w-3 h-3" />
              <span>BƯỚC 6/6 • ĐÃ KÍCH HOẠT</span>
            </span>
            <button
              type="button"
              onClick={handleSkip}
              aria-label="Đóng hướng dẫn"
              className="w-7 h-7 rounded-lg border-[1.5px] border-[#141413] bg-white hover:bg-[#F26B50] flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="font-display text-[17px] font-extrabold text-[#141413] leading-tight">
              Ngụy trang hoạt động chuẩn!
            </h2>
            <p className="text-[12.5px] font-semibold text-[#141413]/85 leading-snug">
              Mở khóa PIN mặc định 0000 hoặc hoàn tất để về cửa hàng thật.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('success');
              playSound('success');
              onComplete();
            }}
            className="w-full min-h-[42px] px-4 rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] border-[2px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display text-[13.5px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 text-[#FFD166] stroke-[2.8]" />
            <span>Hoàn tất</span>
          </button>
        </div>
      </div>
    );
  }

  const layout = cutout
    ? computeTutorialOverlayLayout(cutout, tooltipHeight)
    : null;

  return (
    <div
      className="absolute inset-0 z-50 pointer-events-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={`Hướng dẫn từng bước (${safeStepIndex + 1}/${TUTORIAL_STEP_COUNT})`}
    >
      {/* 4 vùng chặn click ngoài khung khoét sáng, nhường thao tác thật bên trong lỗ khoét */}
      {cutout ? (
        <>
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 right-0 top-0 pointer-events-auto"
            style={{ height: cutout.top }}
            aria-hidden="true"
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 right-0 bottom-0 pointer-events-auto"
            style={{ top: cutout.top + cutout.height }}
            aria-hidden="true"
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 pointer-events-auto"
            style={{
              top: cutout.top,
              height: cutout.height,
              width: cutout.left,
            }}
            aria-hidden="true"
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 pointer-events-auto"
            style={{
              top: cutout.top,
              height: cutout.height,
              left: cutout.left + cutout.width,
            }}
            aria-hidden="true"
          />

          {/* Morphing Spotlight Frame (box-shadow phủ tối 72% xung quanh) */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              left: cutout.left,
              top: cutout.top,
              width: cutout.width,
              height: cutout.height,
              borderRadius: cutout.borderRadius,
              border: '3px solid #FFD166',
              boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.72)',
              transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <span className="absolute -inset-[3px] rounded-[inherit] animate-spotlight-pulse pointer-events-none" />
          </div>

          {/* Mũi tên SVG chỉ từ tooltip tới đúng mục tiêu */}
          {layout && layout.showArrow && (
            <svg
              key={`arrow-${safeStepIndex}`}
              className="absolute inset-0 z-20 w-full h-full pointer-events-none overflow-visible"
              viewBox={`0 0 ${cutout.containerW} ${cutout.containerH}`}
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="tutorial-arrowhead"
                  markerWidth="14"
                  markerHeight="14"
                  refX="2"
                  refY="7"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path
                    d="M 1 1.5 L 12 7 L 1 12.5 Z"
                    fill="#FFD166"
                    stroke="#141413"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </marker>
              </defs>

              <path
                d={layout.arrowPathD}
                fill="none"
                stroke="#141413"
                strokeWidth="7"
                strokeLinecap="butt"
              />
              <path
                d={layout.arrowPathD}
                fill="none"
                stroke="#FFD166"
                strokeWidth="3.5"
                strokeLinecap="butt"
                markerEnd="url(#tutorial-arrowhead)"
              />
            </svg>
          )}
        </>
      ) : (
        <div
          className="absolute inset-0 bg-[#0F172A]/72 pointer-events-auto"
          aria-hidden="true"
        />
      )}

      {/* Hiệu ứng dải băng Neo-Brutalist Zine Wipe (~250ms) khi tự động chuyển màn hình */}
      {wipeTick > 0 && (
        <div
          key={`wipe-${wipeTick}`}
          aria-hidden="true"
          className="absolute inset-y-0 -inset-x-6 z-40 pointer-events-none flex items-center justify-center animate-zine-wipe"
        >
          <div className="w-full h-16 bg-[#FFD166] border-y-[3px] border-[#141413] shadow-[0_6px_0_#141413] flex items-center justify-center gap-3 -rotate-2">
            <span className="px-2.5 py-0.5 rounded bg-[#141413] text-[#FFD166] font-mono text-[11px] font-extrabold uppercase tracking-widest">
              DEMO SANDBOX
            </span>
            <span className="font-display text-[15px] font-extrabold uppercase text-[#141413]">
              ĐANG CHUYỂN BƯỚC TIẾP THEO...
            </span>
          </div>
        </div>
      )}

      {/* Kinetic Tooltip Neo-Brutalism gọn nhẹ + thanh tiến độ 6 đoạn */}
      <div
        key={`tooltip-${safeStepIndex}`}
        ref={tooltipRef}
        className={`pointer-events-auto absolute z-30 animate-kinetic-tooltip rounded-2xl bg-[#FDF6E9] border-[2.5px] border-[#141413] shadow-[5px_5px_0_#141413] p-3.5 space-y-2.5 ${
          layout ? '' : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-24px)] max-w-[340px]'
        }`}
        style={
          layout
            ? {
                left: layout.tooltipLeft,
                top: layout.tooltipTop,
                width: layout.tooltipWidth,
              }
            : undefined
        }
      >
        {/* Thanh tiến độ mảnh 6 đoạn */}
        <div
          className="grid grid-cols-6 gap-1"
          aria-label={`Tiến trình ${safeStepIndex + 1} trên ${TUTORIAL_STEP_COUNT}`}
        >
          {TUTORIAL_STEPS.map((step, idx) => {
            const done = idx < safeStepIndex;
            const active = idx === safeStepIndex;
            return (
              <span
                key={step.id}
                className={`h-1.5 rounded-full transition-colors ${
                  active
                    ? 'bg-[#FFD166] border border-[#141413]'
                    : done
                    ? 'bg-[#0F5C56]'
                    : 'bg-[#141413]/15'
                }`}
              />
            );
          })}
        </div>

        {/* Nhãn bước + nút Bỏ qua */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFD166] border-[1.5px] border-[#141413] font-mono text-[10px] font-extrabold text-[#141413]">
            <Sparkles className="w-3 h-3 text-[#0F5C56]" />
            <span>
              BƯỚC {safeStepIndex + 1}/{TUTORIAL_STEP_COUNT} • DEMO
            </span>
          </span>

          <button
            type="button"
            onClick={handleSkip}
            className="min-h-[28px] px-2 rounded-lg border-[1.5px] border-[#141413] bg-white hover:bg-[#F26B50] font-mono text-[10.5px] font-bold text-[#141413] inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Bỏ qua</span>
            <X className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

        {/* Tiêu đề <= 4 chữ + 1 dòng hướng dẫn <= 12 chữ */}
        <div className="space-y-0.5">
          <h2 className="font-display text-[16px] md:text-[17px] font-extrabold text-[#141413] leading-snug">
            {currentStep.title}
          </h2>
          <p className="text-[12.5px] font-semibold text-[#141413]/85 leading-snug">
            {currentStep.description}
          </p>
        </div>

        {/* Nút điều hướng: Gợi ý / ← Trước nằm cạnh Tiếp theo */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          {isFirstStep ? (
            <span className="font-mono text-[10px] font-bold text-[#0F5C56]">
              Chạm vùng sáng để thử
            </span>
          ) : (
            <span className="font-mono text-[10px] font-bold text-[#141413]/55">
              Bước {safeStepIndex + 1}/{TUTORIAL_STEP_COUNT}
            </span>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handlePrev}
                className="min-h-[36px] px-2.5 rounded-xl bg-white hover:bg-[#FFD166] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-mono text-[11px] font-bold text-[#141413] inline-flex items-center justify-center transition-all cursor-pointer whitespace-nowrap"
              >
                ← Trước
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className={`min-h-[38px] px-4 rounded-xl border-[2px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display text-[13px] font-extrabold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                isLastStep
                  ? 'bg-[#95D5B2] hover:bg-[#FFD166] text-[#141413]'
                  : 'bg-[#0F5C56] hover:bg-[#0C4C47] text-[#FDF6E9]'
              }`}
            >
              {isLastStep ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.8]" />
                  <span>Hoàn tất</span>
                </>
              ) : (
                <>
                  <span>Tiếp theo</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.6]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
