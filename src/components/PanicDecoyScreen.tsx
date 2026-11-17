import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Droplets,
  Minus,
  Pencil,
  Plus,
  RotateCcw,
  X,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';
import {
  DailyHabit,
  WATER_GOAL_OPTIONS,
  WaterGoalMl,
  WaterLogEntry,
  calculateGoalProgress,
  calculateTotalIntakeMl,
} from '../utils/decoyVaultLogic';
import { StealthVaultModal } from './StealthVaultModal';

interface PanicDecoyScreenProps {
  logs: WaterLogEntry[];
  habits: DailyHabit[];
  dailyGoalMl: WaterGoalMl;
  vaultPin: string;
  onAddWater: (amountMl: number) => void;
  onSubtractWater: (amountMl: number) => void;
  onEditLogLabel: (logId: string, nextLabel: string) => void;
  onDeleteLog: (logId: string) => void;
  onToggleHabit: (habitId: string) => void;
  onChangeDailyGoal: (goalMl: WaterGoalMl) => void;
  onResetDay: () => void;
  onChangeVaultPin: (nextPin: string) => void;
  onReturnToStore: () => void;
}

export const PanicDecoyScreen: React.FC<PanicDecoyScreenProps> = ({
  logs,
  habits,
  dailyGoalMl,
  vaultPin,
  onAddWater,
  onSubtractWater,
  onEditLogLabel,
  onDeleteLog,
  onToggleHabit,
  onChangeDailyGoal,
  onResetDay,
  onChangeVaultPin,
  onReturnToStore,
}) => {
  const { playSound } = useSoundFeedback();
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [showVaultModal, setShowVaultModal] = useState<boolean>(false);

  const intakeMl = calculateTotalIntakeMl(logs);
  const { pct, remainingMl, reached } = calculateGoalProgress(
    intakeMl,
    dailyGoalMl
  );
  const completedHabitsCount = habits.filter((h) => h.completed).length;

  const startEditingLog = (entry: WaterLogEntry) => {
    triggerHaptic('tap');
    playSound('click');
    setEditingLogId(entry.id);
    setEditingText(entry.label);
  };

  const commitEditingLog = (logId: string) => {
    if (editingText.trim()) {
      onEditLogLabel(logId, editingText);
      triggerHaptic('toggle');
      playSound('toggle');
    }
    setEditingLogId(null);
    setEditingText('');
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-0 min-w-0 bg-[#FDF6E9] text-[#141413]">
      {/* Header ngụy trang Daily Water */}
      <header className="shrink-0 px-4 md:px-6 py-3 flex items-center justify-between border-b-[2.5px] border-[#141413] bg-[#95D5B2]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white border-[2.5px] border-[#141413] text-[#0F5C56] flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5 stroke-[2.4]" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-[16px] font-extrabold uppercase tracking-tight leading-none">
              Daily Water
            </h1>
            <p className="font-mono text-[10.5px] font-semibold text-[#141413]/80 mt-0.5">
              THEO DÕI UỐNG NƯỚC
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('warning');
            playSound('toggle');
            setEditingLogId(null);
            onResetDay();
          }}
          className="min-h-[38px] px-2.5 sm:px-3 rounded-xl bg-white hover:bg-[#FFD166] border-[2.5px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-all font-mono text-[11px] font-bold"
          aria-label="Đặt lại ngày mới"
          title="Đặt lại ngày mới (0ml & bỏ tick thói quen)"
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-[2.4]" />
          <span className="hidden sm:inline">Reset ngày</span>
        </button>
      </header>

      {/* Main scrollable body */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-4 md:p-6">
        <div className="w-full md:max-w-4xl md:mx-auto grid grid-cols-1 md:grid-cols-12 gap-3.5 md:gap-6 items-start">
          {/* Cột trái: Vòng tròn tiến độ + chọn mục tiêu + nút +/- nước */}
          <section
            aria-label="Tiến độ uống nước hôm nay"
            className="md:col-span-5 bg-white rounded-2xl border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-4 md:p-5 flex flex-col items-center text-center"
          >
            <div className="w-full flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-md bg-[#FFD166] border-[2px] border-[#141413] font-mono text-[10.5px] font-bold uppercase">
                Mục tiêu ngày
              </span>
              <span className="font-mono text-[11px] font-bold text-[#0F5C56] tabular-nums">
                {pct}%
              </span>
            </div>

            {/* Selector tùy chỉnh mục tiêu ngày: 1,500ml / 2,000ml / 2,500ml */}
            <div
              role="group"
              aria-label="Chọn mục tiêu lượng nước mỗi ngày"
              className="grid grid-cols-3 gap-1.5 w-full mb-4"
            >
              {WATER_GOAL_OPTIONS.map((goal) => {
                const isSelected = dailyGoalMl === goal;
                return (
                  <button
                    key={goal}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      triggerHaptic('toggle');
                      playSound('toggle');
                      onChangeDailyGoal(goal);
                    }}
                    className={`min-h-[34px] rounded-lg border-[2px] border-[#141413] font-mono text-[11px] font-bold tabular-nums transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#141413] text-[#FFD166] shadow-[2px_2px_0_#0F5C56]'
                        : 'bg-[#FDF6E9] text-[#141413] hover:bg-[#FFD166]/45'
                    }`}
                  >
                    {goal.toLocaleString('en-US')}ml
                  </button>
                );
              })}
            </div>

            <div className="relative w-36 h-36 flex items-center justify-center mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#E5E5E5"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke={reached ? '#95D5B2' : '#0F5C56'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - pct / 100)}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  data-testid="water-intake-total"
                  className="font-mono text-2xl font-bold text-[#141413] tabular-nums"
                >
                  {intakeMl.toLocaleString('en-US')}ml
                </span>
                <span className="font-mono text-[11px] font-semibold text-[#141413]/70 tabular-nums">
                  / {dailyGoalMl.toLocaleString('en-US')}ml
                </span>
              </div>
            </div>

            <p className="text-[12.5px] font-medium text-[#141413]/80 mb-4 break-words min-h-[36px] flex items-center justify-center">
              {intakeMl === 0
                ? 'Bắt đầu ngày mới — hãy uống ly nước đầu tiên nhé!'
                : reached
                  ? `Đạt mục tiêu ${dailyGoalMl.toLocaleString('en-US')}ml rồi nha, uống đều đặn!`
                  : `Còn thiếu ${remainingMl.toLocaleString('en-US')}ml nữa là đạt mục tiêu hôm nay`}
            </p>

            <div className="grid grid-cols-3 gap-2 w-full">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap');
                  playSound('click');
                  onAddWater(250);
                }}
                className="min-h-[44px] rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] text-white border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none font-mono text-[12px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>+250ml</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap');
                  playSound('click');
                  onAddWater(500);
                }}
                className="min-h-[44px] rounded-xl bg-[#FFD166] hover:bg-[#95D5B2] text-[#141413] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none font-mono text-[12px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>+500ml</span>
              </button>
              <button
                type="button"
                disabled={intakeMl <= 0}
                onClick={() => {
                  if (intakeMl <= 0) return;
                  triggerHaptic('tap');
                  playSound('toggle');
                  onSubtractWater(250);
                }}
                aria-label="Giảm 250ml"
                className={`min-h-[44px] rounded-xl border-[2.5px] border-[#141413] font-mono text-[12px] font-bold flex items-center justify-center gap-1 transition-all ${
                  intakeMl <= 0
                    ? 'bg-[#FDF6E9] text-[#141413]/35 cursor-not-allowed'
                    : 'bg-white hover:bg-[#F26B50]/20 text-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none cursor-pointer'
                }`}
              >
                <Minus className="w-3.5 h-3.5 shrink-0" />
                <span>-250ml</span>
              </button>
            </div>
          </section>

          {/* Cột phải: Thói quen hôm nay + Nhật ký uống nước thực tế */}
          <div className="md:col-span-7 space-y-3.5 md:space-y-4">
            {/* Thói quen hôm nay (Mặc định chưa tick) */}
            <section
              aria-label="Thói quen hôm nay"
              className="bg-white rounded-2xl border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-4 md:p-5"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="font-mono text-[11.5px] font-bold uppercase tracking-wide text-[#141413]">
                  Thói quen hôm nay
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-[#FDF6E9] border-[1.5px] border-[#141413] font-mono text-[10.5px] font-bold text-[#141413] tabular-nums">
                  {completedHabitsCount}/{habits.length} hoàn thành
                </span>
              </div>

              <div className="space-y-2">
                {habits.map((habit) => (
                  <button
                    key={habit.id}
                    type="button"
                    aria-pressed={habit.completed}
                    onClick={() => {
                      triggerHaptic('toggle');
                      playSound('toggle');
                      onToggleHabit(habit.id);
                    }}
                    className={`w-full min-h-[42px] px-3 py-2 rounded-xl border-[2px] border-[#141413] flex items-center justify-between gap-3 text-left transition-all cursor-pointer ${
                      habit.completed
                        ? 'bg-[#95D5B2]/45 shadow-none'
                        : 'bg-[#FDF6E9] hover:bg-[#FFD166]/30 shadow-[2px_2px_0_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-md border-[2px] border-[#141413] flex items-center justify-center shrink-0 transition-colors ${
                          habit.completed ? 'bg-[#0F5C56] text-white' : 'bg-white'
                        }`}
                      >
                        {habit.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </span>
                      <span
                        className={`text-[12.5px] font-semibold leading-snug break-words ${
                          habit.completed
                            ? 'line-through text-[#141413]/70'
                            : 'text-[#141413]'
                        }`}
                      >
                        {habit.label}
                      </span>
                    </div>

                    <span
                      className={`font-mono text-[10px] font-bold uppercase shrink-0 ${
                        habit.completed ? 'text-[#0F5C56]' : 'text-[#141413]/45'
                      }`}
                    >
                      {habit.completed ? 'Đã xong' : 'Chưa tick'}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Nhật ký uống nước hôm nay */}
            <section
              aria-label="Nhật ký uống nước hôm nay"
              className="bg-white rounded-2xl border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-4 md:p-5"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="font-mono text-[11.5px] font-bold uppercase tracking-wide text-[#141413]">
                  Nhật ký uống nước hôm nay ({logs.length})
                </h2>
                {logs.length > 0 && (
                  <span className="font-mono text-[10.5px] text-[#141413]/65">
                    Bấm bút để sửa tên • × để xóa
                  </span>
                )}
              </div>

              {logs.length === 0 ? (
                <div className="rounded-xl border-[2px] border-dashed border-[#141413]/35 bg-[#FDF6E9] p-4 text-center">
                  <p className="text-[12.5px] font-semibold text-[#141413]/75">
                    Chưa có lần uống nước nào được ghi nhận hôm nay.
                  </p>
                  <p className="font-mono text-[10.5px] text-[#141413]/55 mt-1">
                    Bấm +250ml hoặc +500ml để thêm mốc giờ thực tế.
                  </p>
                </div>
              ) : (
                <div className="divide-y-[2px] divide-[#141413]/15">
                  {logs.map((entry) => {
                    const isEditing = editingLogId === entry.id;
                    return (
                      <div
                        key={entry.id}
                        className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2.5 text-[12.5px]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="px-2 py-1 rounded-lg bg-[#95D5B2] border-[2px] border-[#141413] font-mono text-[10.5px] font-bold text-[#141413] tabular-nums shrink-0">
                            {entry.time}
                          </span>

                          {isEditing ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                commitEditingLog(entry.id);
                              }}
                              className="flex items-center gap-1.5 flex-1 min-w-0"
                            >
                              <input
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                aria-label="Sửa tên ghi chú uống nước"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') {
                                    e.stopPropagation();
                                    setEditingLogId(null);
                                  }
                                }}
                                className="flex-1 min-w-0 h-8 px-2 rounded-lg bg-[#FDF6E9] border-[2px] border-[#141413] text-[12px] font-semibold text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#0F5C56]"
                              />
                              <button
                                type="submit"
                                className="h-8 px-2.5 rounded-lg bg-[#0F5C56] text-[#FDF6E9] border-[1.5px] border-[#141413] font-mono text-[10.5px] font-bold cursor-pointer shrink-0"
                              >
                                Lưu
                              </button>
                            </form>
                          ) : (
                            <div className="min-w-0 flex-1 flex items-center gap-1.5">
                              <p className="font-semibold text-[#141413] leading-snug break-words truncate">
                                {entry.label}
                              </p>
                              <button
                                type="button"
                                onClick={() => startEditingLog(entry)}
                                aria-label={`Sửa ghi chú ${entry.label}`}
                                className="w-6 h-6 rounded-md hover:bg-[#FFD166]/60 flex items-center justify-center text-[#141413]/65 hover:text-[#141413] cursor-pointer shrink-0 transition-colors"
                              >
                                <Pencil className="w-3 h-3 stroke-[2.4]" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[12px] font-bold text-[#0F5C56] tabular-nums">
                            +{entry.amountMl}ml
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              triggerHaptic('warning');
                              playSound('toggle');
                              if (editingLogId === entry.id) {
                                setEditingLogId(null);
                              }
                              onDeleteLog(entry.id);
                            }}
                            aria-label={`Xóa ghi nhận ${entry.label} ${entry.amountMl}ml`}
                            className="w-7 h-7 rounded-lg bg-[#FDF6E9] hover:bg-[#F26B50] hover:text-white border-[2px] border-[#141413] flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.6]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Nút Trở lại kín đáo ở đáy màn hình, ấn vào sẽ mở khóa PIN / Face ID */}
      <footer className="shrink-0 px-4 md:px-6 py-2.5 bg-[#FDF6E9] border-t-[2px] border-[#141413]/20 flex justify-end">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('tap');
            playSound('transition');
            setShowVaultModal(true);
          }}
          className="min-h-[38px] px-3.5 rounded-xl bg-white hover:bg-[#FFD166] text-[#141413] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-mono text-[11.5px] font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Trở lại</span>
        </button>
      </footer>

      {/* Modal xác thực PIN 4 số / Face ID */}
      {showVaultModal && (
        <StealthVaultModal
          activePin={vaultPin}
          onChangePin={onChangeVaultPin}
          onUnlockSuccess={() => {
            setShowVaultModal(false);
            onReturnToStore();
          }}
          onClose={() => setShowVaultModal(false)}
        />
      )}
    </div>
  );
};
