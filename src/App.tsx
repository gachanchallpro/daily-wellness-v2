/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import {
  CartItem,
  DeliveryMethod,
  DistrictFilter,
  EWalletType,
  OrderSnapshot,
  Product,
  ProductReview,
  QuizState,
  ScreenId,
  SmartLockerLocation,
} from './types';
import {
  DEFAULT_COURIER_HINT,
  PRODUCTS,
  SMART_LOCKER_LOCATIONS,
} from './data/mockData';
import { triggerHaptic } from './utils/haptics';
import {
  MAX_CART_QTY,
  clampQuantity,
  countOtherPendingOrders,
  createInitialQuizState,
  deleteSingleOrder,
  getMergedProductReviews,
  markOrderCompleted,
  shouldTriggerPanicShortcut,
  submitOrderAnonymousReview,
} from './utils/storeLogic';
import {
  DEFAULT_VAULT_PIN,
  DEFAULT_WATER_GOAL_ML,
  DailyHabit,
  WaterGoalMl,
  WaterLogEntry,
  addWaterLog,
  createInitialHabits,
  formatTimeHHmm,
  removeWaterLogById,
  subtractWaterFromLogs,
  toggleHabitById,
  updateWaterLogLabel,
} from './utils/decoyVaultLogic';
import { useSoundFeedback } from './hooks/useSoundFeedback';
import { PhoneFrame } from './components/PhoneFrame';
import { GlobalHeader } from './components/GlobalHeader';
import { PanicDecoyScreen } from './components/PanicDecoyScreen';
import { MaskedCourierTutorialOverlay } from './components/MaskedCourierTutorialOverlay';
import { OrderListOverlay } from './components/OrderListOverlay';
import { SizeGuideFaqModal } from './components/SizeGuideFaqModal';
import { Screen2GuestHome } from './components/Screen2GuestHome';
import { Screen3FitQuiz } from './components/Screen3FitQuiz';
import { Screen4ProductDetail } from './components/Screen4ProductDetail';
import { Screen5StealthCheckout } from './components/Screen5StealthCheckout';
import { Screen6OtpPickup } from './components/Screen6OtpPickup';
import {
  InteractiveTutorialOverlay,
  TUTORIAL_STEP_COUNT,
} from './components/InteractiveTutorialOverlay';
import {
  TUTORIAL_SANDBOX_ORDER_ID,
  TUTORIAL_STEPS,
  createTutorialSandboxCart,
  createTutorialSandboxOrder,
} from './utils/tutorialLogic';

const SESSION_KEYS = {
  cart: 'dw_session_cart',
  orders: 'dw_session_orders',
  activeOrderId: 'dw_session_active_order_id',
  deliveryMethod: 'dw_session_delivery_method',
  selectedLocker: 'dw_session_selected_locker',
  districtFilter: 'dw_session_district_filter',
  eWallet: 'dw_session_ewallet',
  courierHint: 'dw_session_courier_hint',
  courierNickname: 'dw_session_courier_nickname',
  waterLogs: 'dw_session_water_logs',
  waterHabits: 'dw_session_water_habits',
  waterGoalMl: 'dw_session_water_goal_ml',
  vaultPin: 'dw_session_vault_pin',
  productReviews: 'dw_session_product_reviews',
} as const;

const TUTORIAL_COMPLETED_KEY = 'dw_tutorial_completed';

function readSessionJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeSessionJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('guest-home');
  const [returnScreen, setReturnScreen] = useState<ScreenId>('guest-home');
  const [panicDecoyActive, setPanicDecoyActive] = useState<boolean>(false);
  const [tutorialActive, setTutorialActive] = useState<boolean>(false);
  const [tutorialStep, setTutorialStep] = useState<number>(0);
  const phoneFrameRef = useRef<HTMLDivElement | null>(null);
  const hasAutoTriggeredTutorialRef = useRef<boolean>(false);
  const tutorialCreatedCartRef = useRef<boolean>(false);
  const tutorialCreatedOrderRef = useRef<boolean>(false);
  const tutorialPrevDeliveryRef = useRef<DeliveryMethod | null>(null);
  const wipeToastTimerRef = useRef<number | null>(null);
  const [wipeConfirmation, setWipeConfirmation] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>(createInitialQuizState);

  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [cart, setCart] = useState<CartItem[]>(() =>
    readSessionJson<CartItem[]>(SESSION_KEYS.cart, [])
  );
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(() =>
    readSessionJson<DeliveryMethod>(SESSION_KEYS.deliveryMethod, 'locker')
  );
  const [selectedLocker, setSelectedLocker] =
    useState<SmartLockerLocation | null>(() =>
      readSessionJson<SmartLockerLocation | null>(
        SESSION_KEYS.selectedLocker,
        SMART_LOCKER_LOCATIONS[0]
      )
    );
  const [districtFilter, setDistrictFilter] = useState<DistrictFilter>(() =>
    readSessionJson<DistrictFilter>(SESSION_KEYS.districtFilter, 'ALL')
  );
  const [eWallet, setEWallet] = useState<EWalletType>(() =>
    readSessionJson<EWalletType>(SESSION_KEYS.eWallet, 'Momo')
  );
  const [courierHint, setCourierHint] = useState<string>(() =>
    readSessionJson<string>(SESSION_KEYS.courierHint, DEFAULT_COURIER_HINT)
  );
  const [courierNickname, setCourierNickname] = useState<string>(() =>
    readSessionJson<string>(SESSION_KEYS.courierNickname, 'Khách DW')
  );
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);

  // Danh sách đơn hàng tạm trong phiên (chỉ sessionStorage, KHÔNG localStorage, xóa sạch khi Wipe)
  const [orders, setOrders] = useState<OrderSnapshot[]>(() =>
    readSessionJson<OrderSnapshot[]>(SESSION_KEYS.orders, [])
  );
  const [sessionReviewsByProductId, setSessionReviewsByProductId] = useState<
    Record<string, ProductReview[]>
  >(() =>
    readSessionJson<Record<string, ProductReview[]>>(
      SESSION_KEYS.productReviews,
      {}
    )
  );
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() =>
    readSessionJson<string | null>(SESSION_KEYS.activeOrderId, null)
  );
  const [showOrdersModal, setShowOrdersModal] = useState<boolean>(false);

  const [showCourierTutorial, setShowCourierTutorial] = useState<boolean>(false);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [sizeGuideTab, setSizeGuideTab] = useState<'guide' | 'situations'>(
    'guide'
  );

  // State cho màn hình ngụy trang Daily Water & khóa Stealth Vault trong phiên
  const [waterLogs, setWaterLogs] = useState<WaterLogEntry[]>(() =>
    readSessionJson<WaterLogEntry[]>(SESSION_KEYS.waterLogs, [])
  );
  const [waterHabits, setWaterHabits] = useState<DailyHabit[]>(() =>
    readSessionJson<DailyHabit[]>(
      SESSION_KEYS.waterHabits,
      createInitialHabits()
    )
  );
  const [waterGoalMl, setWaterGoalMl] = useState<WaterGoalMl>(() =>
    readSessionJson<WaterGoalMl>(
      SESSION_KEYS.waterGoalMl,
      DEFAULT_WATER_GOAL_ML
    )
  );
  const [vaultPin, setVaultPin] = useState<string>(() =>
    readSessionJson<string>(SESSION_KEYS.vaultPin, DEFAULT_VAULT_PIN)
  );

  const { playSound } = useSoundFeedback();

  useEffect(() => {
    return () => {
      if (wipeToastTimerRef.current !== null) {
        window.clearTimeout(wipeToastTimerRef.current);
      }
    };
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, item) => sum + item.product.priceVnd * item.quantity, 0),
    [cart]
  );

  const activeOrder = useMemo(
    () => orders.find((o) => o.id === activeOrderId) ?? orders[0] ?? null,
    [orders, activeOrderId]
  );

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.cart, cart);
  }, [cart]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.orders, orders);
  }, [orders]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.productReviews, sessionReviewsByProductId);
  }, [sessionReviewsByProductId]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.activeOrderId, activeOrderId);
  }, [activeOrderId]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.deliveryMethod, deliveryMethod);
  }, [deliveryMethod]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.selectedLocker, selectedLocker);
  }, [selectedLocker]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.districtFilter, districtFilter);
  }, [districtFilter]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.eWallet, eWallet);
  }, [eWallet]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.courierHint, courierHint);
  }, [courierHint]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.courierNickname, courierNickname);
  }, [courierNickname]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.waterLogs, waterLogs);
  }, [waterLogs]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.waterHabits, waterHabits);
  }, [waterHabits]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.waterGoalMl, waterGoalMl);
  }, [waterGoalMl]);

  useEffect(() => {
    writeSessionJson(SESSION_KEYS.vaultPin, vaultPin);
  }, [vaultPin]);

  useEffect(() => {
    if (!panicDecoyActive && screen === 'otp-pickup' && !activeOrder) {
      setScreen('guest-home');
    }
  }, [panicDecoyActive, screen, activeOrder]);

  useEffect(() => {
    if (hasAutoTriggeredTutorialRef.current) return;
    if (screen !== 'guest-home' || panicDecoyActive) return;

    const skipAutoTutorial =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('autostart') === '1';

    let completed = false;
    try {
      completed =
        window.sessionStorage.getItem(TUTORIAL_COMPLETED_KEY) === 'true';
    } catch {
      completed = false;
    }

    if (completed || skipAutoTutorial) {
      hasAutoTriggeredTutorialRef.current = true;
      return;
    }

    const timerId = window.setTimeout(() => {
      hasAutoTriggeredTutorialRef.current = true;
      setTutorialStep(0);
      setTutorialActive(true);
    }, 350);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [screen, panicDecoyActive]);

  const handleTriggerPanicHide = useCallback(() => {
    triggerHaptic('warning');
    playSound('alert');
    setShowOrdersModal(false);
    setShowCourierTutorial(false);
    setShowSizeGuide(false);
    if (tutorialActive && tutorialStep !== 0 && tutorialStep !== TUTORIAL_STEP_COUNT - 1) {
      setTutorialActive(false);
      setTutorialStep(0);
    }
    setPanicDecoyActive(true);
  }, [playSound, tutorialActive, tutorialStep]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        shouldTriggerPanicShortcut({
          key: event.key,
          repeat: event.repeat,
          panicDecoyActive,
        })
      ) {
        event.preventDefault();
        handleTriggerPanicHide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [panicDecoyActive, handleTriggerPanicHide]);

  const navigateTo = (nextScreen: ScreenId) => {
    playSound('transition');
    if (nextScreen === 'checkout') {
      setCheckoutStep(1);
    }
    setScreen(nextScreen);
  };

  const handleOpenCourierTutorial = () => {
    triggerHaptic('tap');
    playSound('transition');
    setShowCourierTutorial(true);
  };

  const handleOpenSizeGuide = (initialTab: 'guide' | 'situations' = 'guide') => {
    triggerHaptic('tap');
    playSound('transition');
    setSizeGuideTab(initialTab);
    setShowSizeGuide(true);
  };

  const handleAddToCart = (product: Product, qty = 1) => {
    triggerHaptic('success');
    playSound('success');
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: clampQuantity(i.quantity + qty) }
            : i
        );
      }
      return [...prev, { product, quantity: clampQuantity(qty) }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    if (delta < 0) {
      triggerHaptic('tap');
    } else {
      triggerHaptic('toggle');
    }
    playSound('toggle');
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: Math.min(MAX_CART_QTY, item.quantity + delta),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleSetQty = (productId: string, nextQuantity: number) => {
    const safeQty = clampQuantity(nextQuantity);
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: safeQty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    triggerHaptic('warning');
    playSound('toggle');
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    triggerHaptic('warning');
    playSound('toggle');
    setCart([]);
  };

  const handleViewProduct = (product: Product, origin: ScreenId) => {
    triggerHaptic('tap');
    setSelectedProduct(product);
    setReturnScreen(origin);
    navigateTo('product-detail');
  };

  const handleConfirmOrder = () => {
    triggerHaptic('success');
    playSound('success');
    const fee = deliveryMethod === 'locker' ? 0 : 18000;
    const totalVnd = cartSubtotal + fee;
    const partA = Math.floor(100 + Math.random() * 899);
    const partB = Math.floor(100 + Math.random() * 899);
    const orderNum = 8821 + orders.length + cartCount;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    const itemsSummary =
      cart.length > 0
        ? cart.map((c) => `${c.product.shortName} ×${c.quantity}`).join(', ')
        : 'Sản phẩm chăm sóc';

    const trimmedHint = courierHint.trim();
    const cleanNickname = courierNickname.trim() || 'Khách DW';
    const combinedCourierHint = trimmedHint
      ? `${trimmedHint} · Biệt danh: ${cleanNickname}`
      : '';

    const newOrder: OrderSnapshot = {
      id: `ord-${Date.now()}`,
      orderCode: `DW-${orderNum}`,
      otpDigits: orders.length === 0 ? '492 - 817' : `${partA} - ${partB}`,
      deliveryMethod,
      lockerLocation: selectedLocker ?? SMART_LOCKER_LOCATIONS[0],
      courierAddressHint: combinedCourierHint,
      eWallet,
      totalVnd,
      readyEstimate:
        deliveryMethod === 'locker'
          ? 'Sẵn sàng sau 20 phút'
          : 'Giao thả 30 phút',
      itemCount: cartCount,
      itemsSummary,
      productIds: cart.map((c) => c.product.id),
      createdAtLabel: `${hh}:${mm}`,
      status: 'ready',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    setCart([]);
    setCheckoutStep(1);
    setScreen('otp-pickup');
  };

  const handleConfirmOrderReceived = (
    orderId: string,
    openCompletedScreen = false
  ) => {
    const completedAtLabel = formatTimeHHmm();
    setOrders((prev) => markOrderCompleted(prev, orderId, completedAtLabel));
    if (openCompletedScreen) {
      setActiveOrderId(orderId);
      setShowOrdersModal(false);
      setScreen('otp-pickup');
    }
  };

  const handleSubmitOrderReview = (
    orderId: string,
    payload: {
      rating: number;
      tags: string[];
      comment: string;
      targetProductId?: string;
      targetProductLabel?: string;
    }
  ) => {
    const submittedAtLabel = formatTimeHHmm();
    const result = submitOrderAnonymousReview({
      orders,
      orderId,
      sessionReviewsByProductId,
      rating: payload.rating,
      tags: payload.tags,
      comment: payload.comment,
      submittedAtLabel,
      targetProductId: payload.targetProductId,
      targetProductLabel: payload.targetProductLabel,
    });
    if (result.didSubmit) {
      setOrders(result.orders);
      setSessionReviewsByProductId(result.sessionReviewsByProductId);
    }
  };

  const handleOpenOrderFromList = (order: OrderSnapshot) => {
    setActiveOrderId(order.id);
    setShowOrdersModal(false);
    setScreen('otp-pickup');
  };

  const handleDeleteSingleOrder = (orderId: string) => {
    triggerHaptic('success');
    playSound('success');
    const remainingOrders = deleteSingleOrder(orders, orderId);
    setOrders(remainingOrders);
    setActiveOrderId((currActiveId) =>
      currActiveId === orderId ? (remainingOrders[0]?.id ?? null) : currActiveId
    );
    setScreen('guest-home');
    setShowOrdersModal(remainingOrders.length > 0);
    setWipeConfirmation('Đã xóa riêng đơn hàng khỏi phiên.');
    if (wipeToastTimerRef.current !== null) {
      window.clearTimeout(wipeToastTimerRef.current);
    }
    wipeToastTimerRef.current = window.setTimeout(() => {
      setWipeConfirmation(null);
      wipeToastTimerRef.current = null;
    }, 3500);
  };

  const cleanupTutorialSandbox = () => {
    if (tutorialCreatedCartRef.current) {
      tutorialCreatedCartRef.current = false;
      setCart([]);
    }
    if (tutorialCreatedOrderRef.current) {
      tutorialCreatedOrderRef.current = false;
      setOrders((prev) =>
        prev.filter((ord) => ord.id !== TUTORIAL_SANDBOX_ORDER_ID)
      );
      setActiveOrderId((curr) =>
        curr === TUTORIAL_SANDBOX_ORDER_ID ? null : curr
      );
    }
    if (tutorialPrevDeliveryRef.current !== null) {
      setDeliveryMethod(tutorialPrevDeliveryRef.current);
      tutorialPrevDeliveryRef.current = null;
    }
  };

  const goToTutorialStep = (targetStep: number) => {
    const clampedStep = Math.max(0, Math.min(TUTORIAL_STEP_COUNT - 1, targetStep));
    const stepSpec = TUTORIAL_STEPS[clampedStep];

    if (stepSpec.screen === 'checkout') {
      if (cart.length === 0) {
        tutorialCreatedCartRef.current = true;
        setCart(createTutorialSandboxCart());
      }
      if (deliveryMethod !== 'locker') {
        if (tutorialPrevDeliveryRef.current === null) {
          tutorialPrevDeliveryRef.current = deliveryMethod;
        }
        setDeliveryMethod('locker');
      }
      setCheckoutStep(1);
    } else if (stepSpec.screen === 'otp-pickup') {
      if (orders.length === 0) {
        tutorialCreatedOrderRef.current = true;
        const sandboxOrder = createTutorialSandboxOrder(
          selectedLocker ?? SMART_LOCKER_LOCATIONS[0],
          eWallet
        );
        setOrders([sandboxOrder]);
        setActiveOrderId(sandboxOrder.id);
      }
    }

    setPanicDecoyActive(false);
    setScreen(stepSpec.screen);
    setTutorialStep(clampedStep);
  };

  const handleCloseAndSaveTutorial = () => {
    try {
      window.sessionStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
    hasAutoTriggeredTutorialRef.current = true;
    cleanupTutorialSandbox();
    setTutorialActive(false);
    setTutorialStep(0);
    setScreen('guest-home');
  };

  const handleOpenTutorialFromHeader = () => {
    playSound('transition');
    setShowOrdersModal(false);
    setShowCourierTutorial(false);
    setShowSizeGuide(false);
    setPanicDecoyActive(false);
    tutorialCreatedCartRef.current = false;
    tutorialCreatedOrderRef.current = false;
    tutorialPrevDeliveryRef.current = null;
    setScreen('guest-home');
    setTutorialStep(0);
    setTutorialActive(true);
  };

  const handleWipeAllTraces = () => {
    triggerHaptic('success');
    playSound('success');
    try {
      const wasTutorialCompleted =
        window.sessionStorage.getItem(TUTORIAL_COMPLETED_KEY) === 'true';
      window.sessionStorage.clear();
      if (wasTutorialCompleted) {
        window.sessionStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
      }
    } catch {
      // Ignore storage errors
    }
    hasAutoTriggeredTutorialRef.current = true;
    setTutorialActive(false);
    setTutorialStep(0);
    setQuizState(createInitialQuizState());
    setCart([]);
    setOrders([]);
    setSessionReviewsByProductId({});
    setActiveOrderId(null);
    setShowOrdersModal(false);
    setSelectedProduct(PRODUCTS[0]);
    setDeliveryMethod('locker');
    setSelectedLocker(SMART_LOCKER_LOCATIONS[0]);
    setDistrictFilter('ALL');
    setEWallet('Momo');
    setCourierHint(DEFAULT_COURIER_HINT);
    setCourierNickname('Khách DW');
    setCheckoutStep(1);
    setPanicDecoyActive(false);
    setShowCourierTutorial(false);
    setShowSizeGuide(false);
    setWaterLogs([]);
    setWaterHabits(createInitialHabits());
    setWaterGoalMl(DEFAULT_WATER_GOAL_ML);
    setVaultPin(DEFAULT_VAULT_PIN);
    setScreen('guest-home');
    setWipeConfirmation(
      'Đã xóa sạch dấu vết phiên: túi hàng, ghi chú, tủ nhận & PIN két đã về mặc định.'
    );
    if (wipeToastTimerRef.current !== null) {
      window.clearTimeout(wipeToastTimerRef.current);
    }
    wipeToastTimerRef.current = window.setTimeout(() => {
      setWipeConfirmation(null);
      wipeToastTimerRef.current = null;
    }, 3500);
  };

  return (
    <PhoneFrame containerRef={phoneFrameRef}>
      {/* Header chung khóa cố định ở trên */}
      {!panicDecoyActive && (
        <GlobalHeader
          cartCount={cartCount}
          onPanicHide={handleTriggerPanicHide}
          onOpenCart={() => navigateTo('checkout')}
          onOpenTutorial={handleOpenTutorialFromHeader}
          onWipeSession={handleWipeAllTraces}
          showCartButton={screen !== 'checkout' && screen !== 'otp-pickup'}
        />
      )}

      {/* Khung thân màn hình độc lập với GlobalHeader */}
      <div className="relative flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
        {wipeConfirmation && !panicDecoyActive && (
          <div
            role="status"
            aria-live="polite"
            className="absolute bottom-[74px] left-3 right-3 md:left-auto md:right-6 md:max-w-md z-40 animate-spring-pop rounded-xl bg-[#95D5B2] border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413] px-3 py-2.5 flex items-start gap-2 text-[#141413]"
          >
            <CheckCircle2
              className="w-4 h-4 text-[#0F5C56] stroke-[2.5] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="flex-1 font-mono text-[11px] md:text-[11.5px] font-bold leading-snug">
              {wipeConfirmation}
            </p>
            <button
              type="button"
              onClick={() => {
                if (wipeToastTimerRef.current !== null) {
                  window.clearTimeout(wipeToastTimerRef.current);
                  wipeToastTimerRef.current = null;
                }
                setWipeConfirmation(null);
              }}
              aria-label="Đóng thông báo xóa phiên"
              className="w-6 h-6 rounded-md bg-white border-[1.5px] border-[#141413] flex items-center justify-center shrink-0 hover:bg-[#FFD166] cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}
        {/* Màn hình ngụy trang Daily Water với nhật ký thực tế & khóa bảo mật Stealth Vault */}
        {panicDecoyActive && (
          <PanicDecoyScreen
            logs={waterLogs}
            habits={waterHabits}
            dailyGoalMl={waterGoalMl}
            vaultPin={vaultPin}
            onAddWater={(amountMl) =>
              setWaterLogs((prev) =>
                addWaterLog(prev, amountMl, formatTimeHHmm())
              )
            }
            onSubtractWater={(amountMl) =>
              setWaterLogs((prev) => subtractWaterFromLogs(prev, amountMl))
            }
            onEditLogLabel={(logId, nextLabel) =>
              setWaterLogs((prev) =>
                updateWaterLogLabel(prev, logId, nextLabel)
              )
            }
            onDeleteLog={(logId) =>
              setWaterLogs((prev) => removeWaterLogById(prev, logId))
            }
            onToggleHabit={(habitId) =>
              setWaterHabits((prev) => toggleHabitById(prev, habitId))
            }
            onChangeDailyGoal={setWaterGoalMl}
            onResetDay={() => {
              setWaterLogs([]);
              setWaterHabits(createInitialHabits());
            }}
            onChangeVaultPin={setVaultPin}
            onReturnToStore={() => setPanicDecoyActive(false)}
          />
        )}

        {/* Màn hình 2: Trang chủ ẩn danh */}
        {!panicDecoyActive && screen === 'guest-home' && (
          <Screen2GuestHome
            products={PRODUCTS}
            cart={cart}
            cartCount={cartCount}
            cartTotal={cartSubtotal}
            orderCount={orders.length}
            onStartQuiz={() => navigateTo('fit-quiz')}
            onSelectProduct={(p) => handleViewProduct(p, 'guest-home')}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onUpdateQty={handleUpdateQty}
            onSetQty={handleSetQty}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onGoToCheckout={() => navigateTo('checkout')}
            onOpenOrderList={() => {
              triggerHaptic('tap');
              playSound('transition');
              setShowOrdersModal(true);
            }}
            onOpenSizeGuide={handleOpenSizeGuide}
          />
        )}

        {/* Màn hình 3: Quiz 30s tức thì */}
        {!panicDecoyActive && screen === 'fit-quiz' && (
          <Screen3FitQuiz
            quizState={quizState}
            onChangeQuizState={setQuizState}
            onBackHome={() => navigateTo('guest-home')}
            onViewProduct={(p) => handleViewProduct(p, 'fit-quiz')}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onGoToCheckout={() => navigateTo('checkout')}
          />
        )}

        {/* Màn hình 4: Chi tiết sản phẩm gọn */}
        {!panicDecoyActive && screen === 'product-detail' && (
          <Screen4ProductDetail
            product={selectedProduct}
            reviews={getMergedProductReviews(
              selectedProduct,
              sessionReviewsByProductId
            )}
            inCartQty={
              cart.find((item) => item.product.id === selectedProduct.id)
                ?.quantity ?? 0
            }
            onBack={() => navigateTo(returnScreen)}
            onAddToCart={(p, qty) => handleAddToCart(p, qty)}
            onRemoveFromCart={handleRemoveFromCart}
            onGoToCheckout={() => navigateTo('checkout')}
            onOpenSizeGuide={() => handleOpenSizeGuide('guide')}
          />
        )}

        {/* Màn hình 5: Thanh toán kín 2 bước */}
        {!panicDecoyActive && screen === 'checkout' && (
          <Screen5StealthCheckout
            cart={cart}
            checkoutStep={checkoutStep}
            onChangeCheckoutStep={setCheckoutStep}
            deliveryMethod={deliveryMethod}
            selectedLocker={selectedLocker}
            districtFilter={districtFilter}
            eWallet={eWallet}
            courierHint={courierHint}
            courierNickname={courierNickname}
            orderCount={orders.length}
            onUpdateQty={handleUpdateQty}
            onSetQty={handleSetQty}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onChangeDeliveryMethod={setDeliveryMethod}
            onSelectLocker={setSelectedLocker}
            onChangeDistrictFilter={setDistrictFilter}
            onChangeEWallet={setEWallet}
            onChangeCourierHint={setCourierHint}
            onChangeCourierNickname={setCourierNickname}
            onConfirmOrder={handleConfirmOrder}
            onBackToCatalog={() => navigateTo('guest-home')}
            onOpenCourierTutorial={handleOpenCourierTutorial}
            onOpenOrderList={() => {
              triggerHaptic('tap');
              playSound('transition');
              setShowOrdersModal(true);
            }}
          />
        )}

        {/* Màn hình 6: Mã OTP nhận hàng & Vị trí tủ / Hoàn tất & Đánh giá */}
        {!panicDecoyActive && screen === 'otp-pickup' && activeOrder && (
          <Screen6OtpPickup
            order={activeOrder}
            orderCount={orders.length}
            pendingOtherOrderCount={countOtherPendingOrders(
              orders,
              activeOrder.id
            )}
            onConfirmReceived={(orderId) =>
              handleConfirmOrderReceived(orderId, false)
            }
            onSubmitReview={handleSubmitOrderReview}
            onSaveAndHome={() => navigateTo('guest-home')}
            onOpenOrderList={() => {
              triggerHaptic('tap');
              playSound('transition');
              setShowOrdersModal(true);
            }}
            onDeleteOrder={handleDeleteSingleOrder}
            onWipeComplete={handleWipeAllTraces}
          />
        )}

        {/* Lớp phủ Hướng dẫn Giao che tên */}
        {!panicDecoyActive && showCourierTutorial && (
          <MaskedCourierTutorialOverlay
            sampleProductName={cart[0]?.product.name}
            orderCode={
              activeOrder?.orderCode ?? `DW-${8821 + orders.length + cartCount}`
            }
            onClose={() => setShowCourierTutorial(false)}
          />
        )}

        {/* Lớp phủ Danh sách đơn tạm trong phiên */}
        {!panicDecoyActive && showOrdersModal && (
          <OrderListOverlay
            orders={orders}
            onClose={() => setShowOrdersModal(false)}
            onOpenOrder={handleOpenOrderFromList}
            onMarkPickedUp={(orderId) =>
              handleConfirmOrderReceived(orderId, true)
            }
            onWipeAllTraces={handleWipeAllTraces}
          />
        )}

        {/* Lớp phủ Tra cứu Tình huống & Cẩm nang đo Size */}
        {!panicDecoyActive && showSizeGuide && (
          <SizeGuideFaqModal
            initialTab={sizeGuideTab}
            cart={cart}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectProduct={(p) => handleViewProduct(p, screen)}
            onClose={() => setShowSizeGuide(false)}
            onStartQuiz={() => navigateTo('fit-quiz')}
          />
        )}
      </div>

      {/* Hướng dẫn tương tác từng bước (Spotlight Walkthrough) */}
      {tutorialActive && (
        <InteractiveTutorialOverlay
          stepIndex={tutorialStep}
          panicDecoyActive={panicDecoyActive}
          containerRef={phoneFrameRef}
          onPrevStep={() => goToTutorialStep(tutorialStep - 1)}
          onNextStep={() => goToTutorialStep(tutorialStep + 1)}
          onSkip={handleCloseAndSaveTutorial}
          onComplete={() => {
            setPanicDecoyActive(false);
            handleCloseAndSaveTutorial();
          }}
        />
      )}
    </PhoneFrame>
  );
}
