import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check,
  Delete,
  KeyRound,
  Lock,
  ScanFace,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';
import {
  DEFAULT_VAULT_PIN,
  isValidFourDigitPin,
  verifyVaultPin,
} from '../utils/decoyVaultLogic';

interface StealthVaultModalProps {
  activePin: string;
  onChangePin: (nextPin: string) => void;
  onUnlockSuccess: () => void;
  onClose: () => void;
}

const KEYPAD_KEYS: ReadonlyArray<string> = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'clear',
  '0',
  'backspace',
];

export const StealthVaultModal: React.FC<StealthVaultModalProps> = ({
  activePin,
  onChangePin,
  onUnlockSuccess,
  onClose,
}) => {
  const { playSound } = useSoundFeedback();
  const [mode, setMode] = useState<'unlock' | 'change-pin'>('unlock');
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [shakeTrigger, setShakeTrigger] = useState<number>(0);

  const [biometricStatus, setBiometricStatus] = useState<
    'idle' | 'scanning' | 'verified'
  >('idle');
  const biometricTimerRef = useRef<number | null>(null);
  const biometricCompleteTimerRef = useRef<number | null>(null);

  // Change PIN form state
  const [currentPinInput, setCurrentPinInput] = useState<string>('');
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [changePinError, setChangePinError] = useState<string | null>(null);
  const [pinChangedNotice, setPinChangedNotice] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (biometricTimerRef.current !== null) {
        window.clearTimeout(biometricTimerRef.current);
      }
      if (biometricCompleteTimerRef.current !== null) {
        window.clearTimeout(biometricCompleteTimerRef.current);
      }
    };
  }, []);

  const submitPinAttempt = useCallback(
    (pinCandidate: string) => {
      if (verifyVaultPin(pinCandidate, activePin)) {
        triggerHaptic('success');
        playSound('success');
        setPinError(null);
        onUnlockSuccess();
      } else {
        triggerHaptic('warning');
        playSound('alert');
        setPinError('Sai mã PIN 4 số. Vui lòng thử lại.');
        setShakeTrigger((prev) => prev + 1);
        setEnteredPin('');
      }
    },
    [activePin, onUnlockSuccess, playSound]
  );

  const handleDigitInput = useCallback(
    (digit: string) => {
      if (biometricStatus !== 'idle' || mode !== 'unlock') return;
      triggerHaptic('tap');
      playSound('click');
      setPinError(null);

      setEnteredPin((prev) => {
        if (prev.length >= 4) return prev;
        const next = `${prev}${digit}`;
        if (next.length === 4) {
          // Verify immediately on the 4th digit without revealing store prematurely
          window.setTimeout(() => {
            submitPinAttempt(next);
          }, 90);
        }
        return next;
      });
    },
    [biometricStatus, mode, playSound, submitPinAttempt]
  );

  const handleBackspace = useCallback(() => {
    if (biometricStatus !== 'idle' || mode !== 'unlock') return;
    triggerHaptic('tap');
    playSound('click');
    setPinError(null);
    setEnteredPin((prev) => prev.slice(0, -1));
  }, [biometricStatus, mode, playSound]);

  const handleClear = useCallback(() => {
    if (biometricStatus !== 'idle' || mode !== 'unlock') return;
    triggerHaptic('tap');
    playSound('click');
    setPinError(null);
    setEnteredPin('');
  }, [biometricStatus, mode, playSound]);

  useEffect(() => {
    if (mode !== 'unlock') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key >= '0' && event.key <= '9') {
        event.preventDefault();
        handleDigitInput(event.key);
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode, handleDigitInput, handleBackspace, onClose]);

  const handleStartBiometric = () => {
    if (biometricStatus !== 'idle') return;
    triggerHaptic('toggle');
    playSound('transition');
    setPinError(null);
    setBiometricStatus('scanning');

    biometricTimerRef.current = window.setTimeout(() => {
      setBiometricStatus('verified');
      triggerHaptic('success');
      playSound('success');
      biometricCompleteTimerRef.current = window.setTimeout(() => {
        onUnlockSuccess();
      }, 150);
    }, 800);
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyVaultPin(currentPinInput, activePin)) {
      triggerHaptic('warning');
      playSound('alert');
      setChangePinError('Mã PIN hiện tại không chính xác.');
      setShakeTrigger((prev) => prev + 1);
      return;
    }
    if (!isValidFourDigitPin(newPinInput)) {
      triggerHaptic('warning');
      playSound('alert');
      setChangePinError('Mã PIN mới phải gồm đúng 4 chữ số.');
      setShakeTrigger((prev) => prev + 1);
      return;
    }

    triggerHaptic('success');
    playSound('success');
    onChangePin(newPinInput);
    setCurrentPinInput('');
    setNewPinInput('');
    setChangePinError(null);
    setEnteredPin('');
    setPinError(null);
    setPinChangedNotice('Đã cập nhật mã PIN phiên mới.');
    setMode('unlock');
  };

  const isDefaultPin = activePin === DEFAULT_VAULT_PIN;

  return (
    <div
      className="absolute inset-0 z-50 bg-[#141413]/75 backdrop-blur-[2px] flex items-center justify-center p-3.5 md:p-6 animate-spring-pop"
      role="dialog"
      aria-modal="true"
      aria-label="Xác thực mở khóa Stealth Vault"
    >
      <div className="w-full max-w-sm bg-[#FDF6E9] rounded-2xl border-[3px] border-[#141413] shadow-[6px_6px_0_#141413] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-[#141413] text-[#FDF6E9] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-lg bg-[#FFD166] text-[#141413] border-[2px] border-[#FDF6E9]/20 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 stroke-[2.6]" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-[14.5px] font-extrabold uppercase tracking-tight leading-none">
                Stealth Vault
              </h2>
              <p className="font-mono text-[10px] text-[#FDF6E9]/75 mt-0.5 truncate">
                {mode === 'unlock'
                  ? 'Xác thực để quay lại cửa hàng'
                  : 'Đổi mã PIN trong phiên'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="px-2 py-0.5 rounded bg-[#FDF6E9]/10 border border-[#FDF6E9]/25 font-mono text-[10px] font-semibold text-[#FFD166]"
              title="Mã PIN thử nghiệm mặc định"
            >
              {isDefaultPin ? `PIN demo: ${DEFAULT_VAULT_PIN}` : 'PIN phiên tùy chỉnh'}
            </span>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap');
                playSound('click');
                onClose();
              }}
              aria-label="Đóng khung mở khóa"
              className="w-7 h-7 rounded-lg bg-[#FDF6E9]/15 hover:bg-[#F26B50] text-[#FDF6E9] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-3.5">
          {mode === 'unlock' ? (
            <>
              {pinChangedNotice && (
                <div className="px-3 py-2 rounded-xl bg-[#95D5B2] border-[2px] border-[#141413] text-[11.5px] font-bold text-[#141413] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.8] shrink-0" />
                  <span>{pinChangedNotice}</span>
                </div>
              )}

              {/* Biometric Face ID / Fingerprint Panel */}
              {biometricStatus !== 'idle' ? (
                <div
                  className="rounded-xl bg-white border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] p-5 flex flex-col items-center text-center space-y-3"
                  aria-live="polite"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl border-[2.5px] border-[#141413] flex items-center justify-center transition-colors ${
                      biometricStatus === 'verified'
                        ? 'bg-[#95D5B2] text-[#0F5C56]'
                        : 'bg-[#FFD166] text-[#141413] animate-pulse'
                    }`}
                  >
                    {biometricStatus === 'verified' ? (
                      <ShieldCheck className="w-8 h-8 stroke-[2.4]" />
                    ) : (
                      <ScanFace className="w-8 h-8 stroke-[2.2]" />
                    )}
                  </div>
                  <div>
                    <p className="font-display text-[14.5px] font-extrabold text-[#141413]">
                      {biometricStatus === 'verified'
                        ? 'Xác thực thành công!'
                        : 'Đang quét Face ID / Vân tay...'}
                    </p>
                    <p className="font-mono text-[10.5px] text-[#141413]/70 mt-0.5">
                      {biometricStatus === 'verified'
                        ? 'Đang mở lại phiên mua sắm kín'
                        : 'Xác nhận sinh trắc học cục bộ trên thiết bị'}
                    </p>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#FDF6E9] border-[1.5px] border-[#141413] overflow-hidden">
                    <div
                      className={`h-full bg-[#0F5C56] transition-all duration-700 ${
                        biometricStatus === 'verified' ? 'w-full' : 'w-4/5'
                      }`}
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* 4-Digit PIN Slot Display */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold uppercase text-[#141413]/80">
                        Nhập mã PIN 4 số
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('tap');
                          playSound('click');
                          setChangePinError(null);
                          setPinChangedNotice(null);
                          setMode('change-pin');
                        }}
                        className="font-mono text-[10.5px] font-bold text-[#0F5C56] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Đổi PIN</span>
                      </button>
                    </div>

                    <div
                      key={shakeTrigger}
                      data-testid="vault-pin-slots"
                      className={`grid grid-cols-4 gap-2.5 p-2.5 rounded-xl bg-white border-[2.5px] ${
                        pinError
                          ? 'border-[#F26B50] animate-pin-shake'
                          : 'border-[#141413]'
                      } shadow-[3px_3px_0_#141413]`}
                    >
                      {[0, 1, 2, 3].map((slotIdx) => {
                        const isFilled = slotIdx < enteredPin.length;
                        const isCurrent = slotIdx === enteredPin.length;
                        return (
                          <div
                            key={slotIdx}
                            className={`h-12 rounded-xl border-[2px] flex items-center justify-center transition-all ${
                              isFilled
                                ? 'bg-[#0F5C56] border-[#141413] text-[#FDF6E9]'
                                : isCurrent
                                  ? 'bg-[#FFD166]/35 border-[#141413]'
                                  : 'bg-[#FDF6E9] border-[#141413]/35'
                            }`}
                          >
                            {isFilled ? (
                              <span
                                className="w-3 h-3 rounded-full bg-[#FDF6E9]"
                                aria-hidden="true"
                              />
                            ) : (
                              <span className="font-mono text-[13px] font-bold text-[#141413]/25">
                                •
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {pinError && (
                      <div
                        role="alert"
                        className="px-2.5 py-1.5 rounded-lg bg-[#F26B50]/20 border-[1.5px] border-[#F26B50] text-[11.5px] font-bold text-[#141413] flex items-center gap-1.5"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-[#F26B50] shrink-0" />
                        <span>{pinError}</span>
                      </div>
                    )}
                  </div>

                  {/* Neo-Brutalism Keypad */}
                  <div className="grid grid-cols-3 gap-2">
                    {KEYPAD_KEYS.map((keyItem) => {
                      if (keyItem === 'clear') {
                        return (
                          <button
                            key="clear"
                            type="button"
                            onClick={handleClear}
                            className="min-h-[42px] rounded-xl bg-[#FDF6E9] hover:bg-[#FFD166]/40 border-[2px] border-[#141413] font-mono text-[11px] font-bold text-[#141413] cursor-pointer transition-colors"
                          >
                            Xoá
                          </button>
                        );
                      }
                      if (keyItem === 'backspace') {
                        return (
                          <button
                            key="backspace"
                            type="button"
                            onClick={handleBackspace}
                            aria-label="Xóa 1 số PIN"
                            className="min-h-[42px] rounded-xl bg-[#FDF6E9] hover:bg-[#FFD166]/40 border-[2px] border-[#141413] flex items-center justify-center text-[#141413] cursor-pointer transition-colors"
                          >
                            <Delete className="w-4 h-4 stroke-[2.2]" />
                          </button>
                        );
                      }
                      return (
                        <button
                          key={keyItem}
                          type="button"
                          onClick={() => handleDigitInput(keyItem)}
                          aria-label={`Số ${keyItem}`}
                          className="min-h-[42px] rounded-xl bg-white hover:bg-[#FFD166] border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-mono text-[15px] font-extrabold text-[#141413] cursor-pointer transition-all"
                        >
                          {keyItem}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Biometric Button */}
                  <button
                    type="button"
                    onClick={handleStartBiometric}
                    className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#95D5B2] hover:bg-[#FFD166] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display text-[13px] font-extrabold text-[#141413] flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <ScanFace className="w-4 h-4 stroke-[2.4] shrink-0" />
                    <span>Mở khóa nhanh bằng Face ID / Vân tay</span>
                  </button>
                </>
              )}
            </>
          ) : (
            <form onSubmit={handleSaveNewPin} className="space-y-3">
              <div
                key={shakeTrigger}
                className={`space-y-2.5 ${changePinError ? 'animate-pin-shake' : ''}`}
              >
                <div>
                  <label
                    htmlFor="current-vault-pin"
                    className="block font-mono text-[11px] font-bold text-[#141413] mb-1"
                  >
                    Mã PIN hiện tại (4 số)
                  </label>
                  <input
                    id="current-vault-pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={currentPinInput}
                    onChange={(e) => {
                      setChangePinError(null);
                      setCurrentPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                    }}
                    placeholder={`Mặc định: ${DEFAULT_VAULT_PIN}`}
                    className="w-full h-11 px-3 rounded-xl bg-white border-[2.5px] border-[#141413] font-mono text-[15px] font-bold tracking-[0.35em] text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#0F5C56]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-vault-pin"
                    className="block font-mono text-[11px] font-bold text-[#141413] mb-1"
                  >
                    Mã PIN mới (4 số)
                  </label>
                  <input
                    id="new-vault-pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={newPinInput}
                    onChange={(e) => {
                      setChangePinError(null);
                      setNewPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                    }}
                    placeholder="Nhập 4 chữ số"
                    className="w-full h-11 px-3 rounded-xl bg-white border-[2.5px] border-[#141413] font-mono text-[15px] font-bold tracking-[0.35em] text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#0F5C56]"
                  />
                </div>
              </div>

              {changePinError && (
                <div
                  role="alert"
                  className="px-2.5 py-1.5 rounded-lg bg-[#F26B50]/20 border-[1.5px] border-[#F26B50] text-[11.5px] font-bold text-[#141413] flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#F26B50] shrink-0" />
                  <span>{changePinError}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('tap');
                    playSound('click');
                    setChangePinError(null);
                    setMode('unlock');
                  }}
                  className="flex-1 min-h-[42px] rounded-xl bg-white hover:bg-[#FDF6E9] border-[2px] border-[#141413] font-mono text-[11.5px] font-bold text-[#141413] cursor-pointer"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[42px] rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-display text-[13px] font-bold text-[#FDF6E9] cursor-pointer transition-all"
                >
                  Lưu PIN mới
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
