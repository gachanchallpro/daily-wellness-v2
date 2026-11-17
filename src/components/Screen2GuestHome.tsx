import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Plus,
  Check,
  ShoppingBag,
  ClipboardList,
  Trash2,
  Ruler,
  Sparkles,
} from 'lucide-react';
import { CartItem, Product } from '../types';
import { formatVnd } from '../data/mockData';
import { PharmacySealSvg, ProductArtwork } from './ProductArtwork';
import { QuantityControl } from './QuantityControl';
import { triggerHaptic } from '../utils/haptics';
import { useSoundFeedback } from '../hooks/useSoundFeedback';
import { ShelfFilter, filterProductsByShelf } from '../utils/storeLogic';

interface Screen2GuestHomeProps {
  products: Product[];
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  orderCount: number;
  onStartQuiz: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onSetQty: (productId: string, nextQty: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onGoToCheckout: () => void;
  onOpenOrderList: () => void;
  onOpenSizeGuide: (initialTab?: 'guide' | 'situations') => void;
}

const FILTER_TABS: Array<{ id: ShelfFilter; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'condom', label: 'Bao cao su' },
  { id: 'contraceptive', label: 'Tránh thai' },
  { id: 'enhancement', label: 'Tăng khoái cảm' },
  { id: 'lubricant', label: 'Gel bôi trơn' },
];

export const Screen2GuestHome: React.FC<Screen2GuestHomeProps> = ({
  products,
  cart,
  cartCount,
  cartTotal,
  orderCount,
  onStartQuiz,
  onSelectProduct,
  onAddToCart,
  onSetQty,
  onRemoveFromCart,
  onClearCart,
  onGoToCheckout,
  onOpenOrderList,
  onOpenSizeGuide,
}) => {
  const { playSound } = useSoundFeedback();
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [shelfFilter, setShelfFilter] = useState<ShelfFilter>('all');
  const addedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current !== null) {
        window.clearTimeout(addedTimerRef.current);
      }
    };
  }, []);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setRecentlyAddedId(product.id);
    if (addedTimerRef.current !== null) {
      window.clearTimeout(addedTimerRef.current);
    }
    addedTimerRef.current = window.setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1000);
  };

  const filteredProducts = useMemo(
    () => filterProductsByShelf(products, shelfFilter),
    [products, shelfFilter]
  );

  const tickerText =
    'XUẤT KHO NHÀ THUỐC TP.HCM • TỦ TỰ ĐỘNG 24/7 • GIAO THẢ KHÔNG GỌI ĐIỆN • ';

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-[#FDF6E9]">
      {/* Marquee mỏng 24px cuộn mượt vô tận, giữ khoảng trắng chuẩn */}
      <div className="shrink-0 w-full h-6 bg-[#141413] text-[#FFD166] border-b-[2px] border-[#141413] overflow-hidden select-none flex items-center">
        <div className="flex w-max shrink-0 items-center animate-marquee font-mono text-[10px] font-bold tracking-wider uppercase whitespace-pre">
          <span className="shrink-0">{tickerText}</span>
          <span className="shrink-0" aria-hidden="true">
            {tickerText}
          </span>
        </div>
      </div>

      {/* Main Scrollable Shelf */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-3.5 md:p-6 space-y-3 md:space-y-5">
        {/* Thẻ Chọn đúng Size & Gu (30s) gọn sạch không rớt chữ */}
        <section
          data-tutorial-target="quiz-banner"
          aria-label="Chọn đúng Size và Gu trong 30 giây"
          className="animate-spring-pop rounded-2xl bg-[#FFD166] border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] p-3.5 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-6"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <PharmacySealSvg className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
              <h1 className="font-display text-[17px] md:text-[20px] font-extrabold text-[#141413] leading-tight">
                Chọn đúng sản phẩm (30s)
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 md:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap');
                onStartQuiz();
              }}
              className="min-h-[36px] md:min-h-[42px] px-3 md:px-4 rounded-xl bg-[#0F5C56] hover:bg-[#0C4C47] border-2 border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] font-display text-[12px] md:text-[13px] font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span>Chọn giúp tôi</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onOpenSizeGuide('situations')}
              className="min-h-[36px] md:min-h-[42px] px-2.5 md:px-3.5 rounded-xl bg-[#95D5B2] hover:bg-white border-2 border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] font-mono text-[10.5px] md:text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0F5C56] shrink-0" />
              <span>Tình huống (5)</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenSizeGuide('guide')}
              className="min-h-[36px] md:min-h-[42px] px-2.5 md:px-3.5 rounded-xl bg-white hover:bg-[#95D5B2] border-2 border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] font-mono text-[10.5px] md:text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Ruler className="w-3.5 h-3.5 text-[#0F5C56] shrink-0" />
              <span>Cách đo size</span>
            </button>
          </div>
        </section>

        {/* Kệ nhà thuốc TP.HCM */}
        <section aria-label="Kệ nhà thuốc TP.HCM" className="space-y-2.5 md:space-y-3.5 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b-[2px] border-[#141413] pb-2">
            <h2 className="font-display text-[14.5px] md:text-[17px] font-extrabold text-[#141413]">
              Kệ nhà thuốc TP.HCM ({filteredProducts.length})
            </h2>

            {/* Filter Chips ngang gọn */}
            <div
              className="flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar pb-0.5 md:pb-0"
              role="tablist"
              aria-label="Lọc nhanh sản phẩm"
            >
              {FILTER_TABS.map((tab) => {
                const active = shelfFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      triggerHaptic('toggle');
                      playSound('toggle');
                      setShelfFilter(tab.id);
                    }}
                    className={`min-h-[30px] md:min-h-[34px] px-2.5 md:px-3.5 rounded-full border-2 border-[#141413] font-mono text-[10.5px] md:text-[11px] font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      active
                        ? 'bg-[#141413] text-[#FFD166] shadow-none'
                        : 'bg-white text-[#141413] shadow-[2px_2px_0_#141413] hover:bg-[#FDF6E9]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile: 1 cột gọn gàng; Desktop (md/lg): Lưới 2-3 cột */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-4">
            {filteredProducts.map((product, index) => {
              const isAdded = recentlyAddedId === product.id;
              const qtyInCart =
                cart.find((item) => item.product.id === product.id)?.quantity ??
                0;

              return (
                <article
                  key={product.id}
                  data-tutorial-target={index === 0 ? 'first-product-card' : undefined}
                  onClick={() => onSelectProduct(product)}
                  className="rounded-2xl bg-white border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] hover:bg-[#FFFDF8] md:hover:-translate-y-0.5 md:hover:shadow-[5px_5px_0_#141413] p-2.5 md:p-4 flex flex-row md:flex-col items-center md:items-stretch md:justify-between gap-2.5 md:gap-3.5 transition-all cursor-pointer min-w-0 h-full"
                >
                  <div className="flex items-center md:items-start gap-2.5 md:gap-3 flex-1 min-w-0">
                    <ProductArtwork product={product} size="sm" />

                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-[#95D5B2]/60 border border-[#141413]/40 font-mono text-[9.5px] font-bold text-[#141413] leading-none mb-1">
                        {product.highlightBadge}
                      </span>
                      <h3 className="font-display text-[14px] md:text-[15.5px] font-extrabold text-[#141413] leading-snug line-clamp-2 break-words">
                        {product.shortName}
                      </h3>
                      <p className="text-[11px] md:text-[11.5px] font-medium text-[#141413]/75 mt-0.5 leading-snug break-words">
                        {product.pharmacyPartner} · {product.packSize}
                      </p>
                      <p className="hidden md:line-clamp-2 text-[12px] font-medium text-[#141413]/70 mt-1.5 leading-snug">
                        {product.summary}
                      </p>
                    </div>
                  </div>

                  <div
                    data-tutorial-target={index === 0 ? 'first-product-qty' : undefined}
                    className="flex flex-col md:flex-row items-end md:items-center md:justify-between gap-1 md:gap-2 shrink-0 md:pt-3 md:border-t md:border-dashed md:border-[#141413]/20"
                  >
                    <span className="font-mono text-[13px] md:text-[15px] font-bold text-[#0F5C56] md:text-[#141413] tabular-nums">
                      {formatVnd(product.priceVnd)}
                    </span>

                    {qtyInCart > 0 ? (
                      <QuantityControl
                        value={qtyInCart}
                        itemLabel={product.shortName}
                        size="sm"
                        onChange={(nextQty) => onSetQty(product.id, nextQty)}
                        onDecrementAtOne={() => onRemoveFromCart(product.id)}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        aria-label={`Thêm ${product.shortName} vào túi`}
                        className={`min-w-[64px] md:min-w-[82px] min-h-[32px] md:min-h-[36px] px-2 md:px-3 rounded-lg border-[2px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-mono text-[10.5px] md:text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-[#0F5C56] text-white'
                            : 'bg-[#95D5B2] hover:bg-[#FFD166] text-[#141413]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3 stroke-[2.6]" />
                            <span>Đã thêm</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 stroke-[2.6]" />
                            <span>Thêm</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {/* Bottom Bar */}
      <footer
        className={`shrink-0 px-3.5 md:px-6 bg-[#FDF6E9] border-t-[2.5px] border-[#141413] flex items-center gap-2 ${
          cartCount === 0 && orderCount === 0
            ? 'py-1.5 md:py-2 justify-center'
            : 'py-2 md:py-2.5 justify-between'
        }`}
      >
        <p
          className={
            cartCount === 0 && orderCount === 0
              ? 'font-mono text-[10px] md:text-[11px] font-bold text-[#0F5C56] text-center'
              : 'hidden md:block font-mono text-[11px] font-bold text-[#0F5C56]'
          }
        >
          {cartCount > 0
            ? 'TÚI TẠM TRONG PHIÊN • ĐÓNG GÓI HỘP NÂU TRƠN 2 LỚP'
            : '100% TRÊN PHIÊN • TỰ ĐỘNG XÓA KHI ĐÓNG TAB'}
        </p>

        {(cartCount > 0 || orderCount > 0) && (
          <div className="flex items-center gap-2 flex-1 md:flex-none min-w-0 justify-end">
            {cartCount > 0 && (
              <>
                <button
                  type="button"
                  onClick={onClearCart}
                  aria-label="Xoá hết sản phẩm trong túi"
                  title="Xoá hết túi"
                  className="w-[42px] h-[42px] shrink-0 rounded-xl bg-white hover:bg-[#F26B50] border-[2.5px] border-[#141413] shadow-[2px_2px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] flex items-center justify-center transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 stroke-[2.3]" />
                </button>
                <button
                  type="button"
                  onClick={onGoToCheckout}
                  className="flex-1 md:flex-none md:min-w-[230px] min-w-0 min-h-[42px] px-3 md:px-4 rounded-xl bg-[#141413] hover:bg-[#262624] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#0F5C56] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#FDF6E9] flex items-center justify-between gap-2 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 font-mono text-[11.5px] md:text-[12px] font-bold">
                    <ShoppingBag className="w-4 h-4 text-[#FFD166] shrink-0" />
                    <span className="tabular-nums">Túi ({cartCount})</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[12px] md:text-[13px] font-bold text-[#95D5B2] tabular-nums shrink-0">
                    <span>{formatVnd(cartTotal)}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </>
            )}

            {orderCount > 0 && (
              <button
                type="button"
                onClick={onOpenOrderList}
                className="shrink-0 min-h-[42px] px-3 md:px-4 rounded-xl bg-[#FFD166] hover:bg-[#95D5B2] border-[2.5px] border-[#141413] shadow-[3px_3px_0_#141413] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#141413] font-mono text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span>Đơn của bạn ({orderCount})</span>
              </button>
            )}
          </div>
        )}
      </footer>
    </div>
  );
};
