import React, { useEffect, useRef, useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';
import {
  MAX_CART_QTY,
  MIN_CART_QTY,
  clampQuantity,
  parseQuantityInput,
} from '../utils/storeLogic';

interface QuantityControlProps {
  value: number;
  onChange: (nextQty: number) => void;
  onDecrementAtOne?: () => void;
  itemLabel: string;
  size?: 'sm' | 'md';
  min?: number;
  max?: number;
  bgTone?: 'cream' | 'white';
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  value,
  onChange,
  onDecrementAtOne,
  itemLabel,
  size = 'sm',
  min = MIN_CART_QTY,
  max = MAX_CART_QTY,
  bgTone = 'cream',
}) => {
  const { playSound } = useSoundFeedback();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>(String(value));
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setDraft(String(value));
    }
  }, [value, isEditing]);

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('tap');
    playSound('click');
    setDraft(String(value));
    setIsEditing(true);
  };

  const commitDraft = () => {
    const nextQty = parseQuantityInput(draft, min, max);
    if (nextQty !== value) {
      triggerHaptic('toggle');
      playSound('toggle');
      onChange(nextQty);
    }
    setDraft(String(nextQty));
    setIsEditing(false);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value <= min) {
      if (onDecrementAtOne) {
        onDecrementAtOne();
      }
      return;
    }
    triggerHaptic('tap');
    playSound('click');
    onChange(clampQuantity(value - 1, min, max));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value >= max) return;
    triggerHaptic('toggle');
    playSound('click');
    onChange(clampQuantity(value + 1, min, max));
  };

  const isSmall = size === 'sm';
  const heightCls = isSmall ? 'h-[32px] md:h-[36px]' : 'h-[40px] md:h-[42px]';
  const btnWidthCls = isSmall ? 'w-7 md:w-8' : 'w-9';
  const centerWidthCls = isSmall ? 'w-8 md:w-9' : 'w-11';
  const textSizeCls = isSmall ? 'text-[12px]' : 'text-[14px]';
  const containerBg = bgTone === 'white' ? 'bg-white' : 'bg-[#FDF6E9]';

  const showTrashIcon = value <= min && Boolean(onDecrementAtOne);
  const isMinusDisabled = value <= min && !onDecrementAtOne;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center border-[2px] border-[#141413] rounded-xl ${containerBg} shadow-[2px_2px_0_#141413] ${heightCls} overflow-hidden shrink-0`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isMinusDisabled}
        aria-label={
          showTrashIcon
            ? `Xoá ${itemLabel} khỏi túi`
            : `Giảm số lượng ${itemLabel}`
        }
        className={`${btnWidthCls} h-full flex items-center justify-center transition-colors ${
          isMinusDisabled
            ? 'text-[#141413]/30 cursor-not-allowed'
            : showTrashIcon
              ? 'text-[#141413] hover:bg-[#F26B50] cursor-pointer'
              : 'text-[#141413] hover:bg-[#FFD166] cursor-pointer'
        }`}
      >
        {showTrashIcon ? (
          <Trash2 className="w-3.5 h-3.5" />
        ) : (
          <Minus className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} stroke-[2.8]`} />
        )}
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={draft}
          aria-label={`Số lượng ${itemLabel}`}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '') {
              setDraft('');
              return;
            }
            const digitsOnly = raw.replace(/\D/g, '').slice(0, 2);
            setDraft(digitsOnly);
          }}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitDraft();
            }
          }}
          className={`${centerWidthCls} h-full text-center font-mono ${textSizeCls} font-bold text-[#0F5C56] bg-[#FFD166]/45 border-x border-[#141413] focus:outline-none tabular-nums no-number-spinner`}
        />
      ) : (
        <button
          type="button"
          onClick={startEditing}
          aria-label={`Nhập số lượng ${itemLabel} (hiện tại ${value})`}
          title="Chạm để nhập số lượng (1–99)"
          className={`${centerWidthCls} h-full text-center font-mono ${textSizeCls} font-bold text-[#0F5C56] hover:bg-[#FFD166]/40 border-x border-[#141413]/20 tabular-nums cursor-text transition-colors`}
        >
          {value}
        </button>
      )}

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label={`Tăng số lượng ${itemLabel}`}
        className={`${btnWidthCls} h-full flex items-center justify-center transition-colors ${
          value >= max
            ? 'text-[#141413]/30 cursor-not-allowed'
            : 'text-[#141413] hover:bg-[#95D5B2] cursor-pointer'
        }`}
      >
        <Plus className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} stroke-[2.8]`} />
      </button>
    </div>
  );
};
