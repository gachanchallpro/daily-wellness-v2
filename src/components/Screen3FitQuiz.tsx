import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  RotateCcw,
  Ruler,
} from 'lucide-react';
import { Product, QuizAnswers, QuizGoal, QuizState } from '../types';
import {
  formatVnd,
  getQuizStepConfig,
  matchQuizProducts,
} from '../data/mockData';
import { PharmacySealSvg, ProductArtwork } from './ProductArtwork';
import { useSoundFeedback } from '../hooks/useSoundFeedback';
import { triggerHaptic } from '../utils/haptics';
import { createInitialQuizState } from '../utils/storeLogic';

interface Screen3FitQuizProps {
  quizState: QuizState;
  onChangeQuizState: React.Dispatch<React.SetStateAction<QuizState>>;
  onBackHome: () => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onGoToCheckout: () => void;
}

const TOTAL_STEPS = 3;

export const Screen3FitQuiz: React.FC<Screen3FitQuizProps> = ({
  quizState,
  onChangeQuizState,
  onBackHome,
  onViewProduct,
  onAddToCart,
  onGoToCheckout,
}) => {
  const { playSound } = useSoundFeedback();
  const [showInlineSizeTip, setShowInlineSizeTip] = useState<boolean>(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const { phase, stepIndex, answers, results } = quizState;
  const currentStep = getQuizStepConfig(stepIndex, answers.goal);
  const progressPct =
    phase === 'questions' ? ((stepIndex + 1) / TOTAL_STEPS) * 100 : 100;

  const handleSelectOption = (value: string) => {
    let updatedAnswers: QuizAnswers;

    if (currentStep.id === 'goal') {
      const nextGoal = value as QuizGoal;
      updatedAnswers = {
        goal: nextGoal,
        preference: answers.goal === nextGoal ? answers.preference : '',
        budget: answers.budget,
      };
    } else {
      updatedAnswers = { ...answers, [currentStep.id]: value };
    }

    setShowInlineSizeTip(false);

    if (stepIndex < TOTAL_STEPS - 1) {
      triggerHaptic('toggle');
      playSound('toggle');
      onChangeQuizState((prev) => ({
        ...prev,
        answers: updatedAnswers,
        stepIndex: prev.stepIndex + 1,
      }));
    } else {
      triggerHaptic('success');
      playSound('success');
      onChangeQuizState({
        phase: 'results',
        stepIndex,
        answers: updatedAnswers,
        results: matchQuizProducts(updatedAnswers),
      });
    }
  };

  const handleBackStep = () => {
    triggerHaptic('tap');
    playSound('click');
    setShowInlineSizeTip(false);
    if (phase === 'results') {
      onChangeQuizState((prev) => ({
        ...prev,
        phase: 'questions',
        stepIndex: TOTAL_STEPS - 1,
      }));
      return;
    }
    if (stepIndex > 0) {
      onChangeQuizState((prev) => ({
        ...prev,
        stepIndex: prev.stepIndex - 1,
      }));
    } else {
      onBackHome();
    }
  };

  const handleRetake = () => {
    triggerHaptic('toggle');
    playSound('toggle');
    setShowInlineSizeTip(false);
    onChangeQuizState(createInitialQuizState());
  };

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
  };

  const isCondomBranch = answers.goal === 'condom';
  const isContraceptiveBranch = answers.goal === 'contraceptive';

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-[#FDF6E9]">
      {/* Sub-navigation + Ink Progress Bar */}
      <div className="shrink-0 px-3.5 md:px-6 pt-2.5 pb-2.5 border-b-[2.5px] border-[#141413] bg-white">
        <div className="flex items-center justify-between gap-2 mb-2">
          <button
            type="button"
            onClick={handleBackStep}
            className="min-h-[34px] px-2.5 rounded-lg border-[2px] border-[#141413] bg-[#FDF6E9] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1 font-mono text-[11px] font-bold text-[#141413] cursor-pointer transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {stepIndex === 0 && phase === 'questions' ? 'Trang chủ' : 'Quay lại'}
            </span>
          </button>

          <span className="px-2.5 py-1 rounded-md bg-[#FFD166] border-[2px] border-[#141413] font-mono text-[11px] font-bold text-[#141413] tabular-nums">
            {phase === 'questions'
              ? `Câu 0${stepIndex + 1} / 0${TOTAL_STEPS}`
              : `TOP ${results.length} GỢI Ý`}
          </span>
        </div>

        <div className="w-full h-2 bg-[#FDF6E9] border-[2px] border-[#141413] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0F5C56] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Main Flashcard Area */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-3.5 md:p-6 flex flex-col">
        {phase === 'questions' && (
          <div
            key={`${currentStep.id}-${answers.goal || 'root'}`}
            className="animate-spring-pop flex-1 flex flex-col min-w-0 w-full md:max-w-2xl md:mx-auto"
          >
            <div className="rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-4 mb-3">
              <h1 className="font-display text-[19px] font-extrabold text-[#141413] leading-snug break-words">
                {currentStep.question}
              </h1>
              <p className="text-[12px] font-medium text-[#141413]/75 mt-1 break-words">
                {currentStep.helper}
              </p>
            </div>

            <div className="space-y-2.5">
              {currentStep.options.map((opt) => {
                const isSelected = answers[currentStep.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full min-h-[56px] text-left rounded-2xl p-3 border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center justify-between gap-3 min-w-0 ${
                      isSelected
                        ? 'bg-[#0F5C56] text-[#FDF6E9]'
                        : 'bg-white hover:bg-[#FFD166]/40 text-[#141413]'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-display text-[14px] font-bold leading-snug break-words">
                        {opt.label}
                      </p>
                      <p
                        className={`text-[11.5px] mt-0.5 break-words ${
                          isSelected ? 'text-[#95D5B2]' : 'text-[#141413]/70'
                        }`}
                      >
                        {opt.detail}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-lg border-[2px] border-[#141413] flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#FFD166] text-[#141413]' : 'bg-[#FDF6E9]'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}

              {/* Mẹo đo chu vi 15s hiển thị khi chọn nhánh Bao cao su */}
              {stepIndex === 1 && isCondomBranch && (
                <div className="space-y-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('toggle');
                      playSound('toggle');
                      setShowInlineSizeTip((prev) => !prev);
                    }}
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#FFD166] hover:bg-[#95D5B2] border-2 border-[#141413] shadow-[3px_3px_0_#141413] flex items-center justify-between gap-2 font-mono text-[11px] font-bold text-[#141413] cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Ruler className="w-4 h-4 text-[#0F5C56] shrink-0" />
                      <span>Chưa biết size → Mẹo đo chu vi 15 giây</span>
                    </span>
                    <span className="text-[#0F5C56] underline shrink-0">
                      {showInlineSizeTip ? 'Ẩn mẹo' : 'Xem ngay'}
                    </span>
                  </button>

                  {showInlineSizeTip && (
                    <div className="animate-spring-pop rounded-xl bg-[#95D5B2]/45 border-2 border-[#141413] p-3 space-y-2">
                      <p className="text-[12px] font-semibold text-[#141413] leading-snug">
                        Quấn dây đo chu vi lúc cương, lấy{' '}
                        <strong className="text-[#0F5C56]">
                          chu vi (mm) ÷ 2 = size bao
                        </strong>{' '}
                        (VD: 104mm ÷ 2 = 52mm). Chạm chọn nhanh bên dưới:
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSelectOption('snug-49')}
                          className="rounded-lg bg-white hover:bg-[#FFD166] border border-[#141413] py-1.5 px-1 text-center cursor-pointer transition-colors"
                        >
                          <span className="block font-mono text-[10px] font-bold text-[#141413]/70">
                            &lt; 10cm
                          </span>
                          <span className="block font-display text-[12.5px] font-extrabold text-[#0F5C56]">
                            Chọn 49mm
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectOption('standard-thin')}
                          className="rounded-lg bg-white hover:bg-[#FFD166] border border-[#141413] py-1.5 px-1 text-center cursor-pointer transition-colors"
                        >
                          <span className="block font-mono text-[10px] font-bold text-[#141413]/70">
                            10–11cm
                          </span>
                          <span className="block font-display text-[12.5px] font-extrabold text-[#141413]">
                            Chọn 52mm
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectOption('large-nonlatex')}
                          className="rounded-lg bg-white hover:bg-[#FFD166] border border-[#141413] py-1.5 px-1 text-center cursor-pointer transition-colors"
                        >
                          <span className="block font-mono text-[10px] font-bold text-[#141413]/70">
                            &gt; 11cm
                          </span>
                          <span className="block font-display text-[12.5px] font-extrabold text-[#0F5C56]">
                            Chọn 55mm+
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Lưu ý thời điểm dùng khi chọn nhánh Thuốc tránh thai */}
              {stepIndex === 1 && isContraceptiveBranch && (
                <div className="rounded-xl bg-[#95D5B2]/40 border-2 border-[#141413] p-3 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#0F5C56] shrink-0 mt-0.5" />
                  <p className="text-[12px] font-medium text-[#141413] leading-snug">
                    <strong className="text-[#0F5C56]">Lưu ý thời điểm:</strong>{' '}
                    Thuốc khẩn cấp 72h đạt hiệu quả cao nhất trong 12–24 giờ đầu;
                    thuốc vỉ 28 viên cần uống đều 1 giờ cố định mỗi ngày và không
                    phòng bệnh lây truyền qua đường tình dục.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'results' && (
          <div className="animate-spring-pop space-y-3.5 md:space-y-5 min-w-0 pb-2 w-full md:max-w-5xl md:mx-auto">
            <div className="rounded-2xl bg-[#FFD166] border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-3.5 md:p-5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-bold uppercase text-[#0F5C56]">
                  Lọc tức thì trên máy • 0 gửi dữ liệu
                </p>
                <h2 className="font-display text-[18px] md:text-[20px] font-extrabold text-[#141413] leading-tight">
                  Top {results.length} gợi ý phù hợp nhất cho bạn
                </h2>
              </div>
              <button
                type="button"
                onClick={handleRetake}
                aria-label="Làm lại Quiz"
                className="min-w-[36px] min-h-[36px] px-2.5 md:px-3.5 rounded-lg bg-white border-[2px] border-[#141413] flex items-center gap-1 font-mono text-[10.5px] font-bold cursor-pointer hover:bg-[#FDF6E9] shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại Quiz</span>
              </button>
            </div>

            <div
              className={`grid grid-cols-1 gap-3.5 md:gap-4 ${
                results.length >= 3
                  ? 'md:grid-cols-2 lg:grid-cols-3'
                  : 'md:grid-cols-2'
              }`}
            >
              {results.map((item, idx) => {
                const added = !!addedIds[item.product.id];
                return (
                  <article
                    key={item.product.id}
                    className="rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-3.5 md:p-4 flex flex-col justify-between gap-3 min-w-0"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md border-[2px] border-[#141413] font-mono text-[10.5px] font-bold ${
                            idx === 0
                              ? 'bg-[#95D5B2] text-[#141413]'
                              : 'bg-[#FDF6E9] text-[#141413]'
                          }`}
                        >
                          {item.matchLabel}
                        </span>
                        <span className="font-mono text-[14.5px] font-bold text-[#141413] tabular-nums">
                          {formatVnd(item.product.priceVnd)}
                        </span>
                      </div>

                      <div className="flex gap-3 min-w-0 items-center">
                        <ProductArtwork product={item.product} size="sm" />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-[15px] font-extrabold text-[#141413] leading-snug break-words">
                            {item.product.name}
                          </h3>
                          <p className="text-[11.5px] font-medium text-[#141413]/70 mt-0.5 break-words">
                            {item.product.packSize} · {item.product.pharmacyPartner}
                          </p>
                        </div>
                        {idx === 0 && (
                          <PharmacySealSvg className="w-8 h-8 shrink-0" />
                        )}
                      </div>

                      <div className="rounded-xl bg-[#FDF6E9] border-[2px] border-[#141413] p-2.5 space-y-2">
                        <div>
                          <p className="font-mono text-[10px] font-bold uppercase text-[#0F5C56] mb-1">
                            Vì sao khớp với bạn:
                          </p>
                          <ul className="space-y-1">
                            {item.reasons.map((reason) => (
                              <li
                                key={reason}
                                className="text-[12px] font-medium text-[#141413] flex items-start gap-1.5 leading-snug break-words"
                              >
                                <Check className="w-3.5 h-3.5 text-[#0F5C56] stroke-[3] shrink-0 mt-0.5" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {item.timingNote && (
                          <div className="pt-2 border-t border-dashed border-[#141413]/25 flex items-start gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#F26B50] shrink-0 mt-0.5" />
                            <p className="text-[11px] font-medium text-[#141413]/85 leading-snug break-words">
                              {item.timingNote}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onViewProduct(item.product)}
                        className="min-h-[40px] rounded-xl border-[2.5px] border-[#141413] bg-white hover:bg-[#FDF6E9] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display text-[12.5px] font-bold text-[#141413] transition-all cursor-pointer"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          added ? onGoToCheckout() : handleAdd(item.product)
                        }
                        className={`min-h-[40px] rounded-xl border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display text-[12.5px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          added
                            ? 'bg-[#141413] text-[#FFD166]'
                            : 'bg-[#0F5C56] hover:bg-[#0C4C47] text-[#FDF6E9]'
                        }`}
                      >
                        {added ? 'Mở túi hàng →' : 'Thêm vào túi'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
