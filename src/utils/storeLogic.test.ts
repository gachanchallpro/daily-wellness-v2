import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRODUCTS,
  SMART_LOCKER_LOCATIONS,
  formatVnd,
  matchQuizProducts,
} from '../data/mockData';
import { OrderSnapshot } from '../types';
import {
  ORDER_GENERAL_REVIEW_TARGET,
  calculateCheckoutSummary,
  canConfirmCheckout,
  clampQuantity,
  countOtherPendingOrders,
  createInitialQuizState,
  deleteSingleOrder,
  filterLockersByDistrict,
  filterProductsByShelf,
  formatLockerCompactTitle,
  formatStep2DeliverySummary,
  getMergedProductReviews,
  getOrderReviewTargets,
  isOrderCompleted,
  markOrderCompleted,
  parseQuantityInput,
  shouldTriggerPanicShortcut,
  submitOrderAnonymousReview,
} from './storeLogic';

test('shouldTriggerPanicShortcut activates only on Escape while store is active', () => {
  assert.equal(
    shouldTriggerPanicShortcut({ key: 'Escape', panicDecoyActive: false }),
    true
  );
  assert.equal(
    shouldTriggerPanicShortcut({ key: 'Esc', panicDecoyActive: false }),
    true
  );
  assert.equal(
    shouldTriggerPanicShortcut({
      key: 'Escape',
      repeat: true,
      panicDecoyActive: false,
    }),
    false
  );
  assert.equal(
    shouldTriggerPanicShortcut({ key: 'Escape', panicDecoyActive: true }),
    false
  );
  assert.equal(
    shouldTriggerPanicShortcut({ key: 'Enter', panicDecoyActive: false }),
    false
  );
});

test('filterProductsByShelf filters all 5 shelf tabs accurately', () => {
  const all = filterProductsByShelf(PRODUCTS, 'all');
  assert.equal(all.length, PRODUCTS.length);

  const condoms = filterProductsByShelf(PRODUCTS, 'condom');
  assert.ok(condoms.length >= 6);
  assert.equal(condoms[0].shortWidth, '49mm');
  assert.ok(condoms.every((p) => p.category === 'condom'));

  const contraceptives = filterProductsByShelf(PRODUCTS, 'contraceptive');
  assert.ok(contraceptives.length >= 3);
  assert.ok(contraceptives.every((p) => p.category === 'contraceptive'));

  const enhancements = filterProductsByShelf(PRODUCTS, 'enhancement');
  assert.ok(enhancements.length >= 3);
  assert.ok(enhancements.every((p) => p.category === 'enhancement'));

  const lubricants = filterProductsByShelf(PRODUCTS, 'lubricant');
  assert.ok(lubricants.length >= 2);
  assert.ok(lubricants.every((p) => p.category === 'lubricant'));
});

test('calculateCheckoutSummary computes locker vs courier fees accurately', () => {
  assert.deepEqual(calculateCheckoutSummary([], 'courier'), {
    totalQty: 0,
    subtotalVnd: 0,
    deliveryFeeVnd: 0,
    totalVnd: 0,
  });

  const sampleCart = [
    { product: PRODUCTS[0], quantity: 2 },
    { product: PRODUCTS[3], quantity: 1 },
  ];
  const expectedSubtotal = PRODUCTS[0].priceVnd * 2 + PRODUCTS[3].priceVnd;

  assert.deepEqual(calculateCheckoutSummary(sampleCart, 'locker'), {
    totalQty: 3,
    subtotalVnd: expectedSubtotal,
    deliveryFeeVnd: 0,
    totalVnd: expectedSubtotal,
  });

  assert.deepEqual(calculateCheckoutSummary(sampleCart, 'courier'), {
    totalQty: 3,
    subtotalVnd: expectedSubtotal,
    deliveryFeeVnd: 18000,
    totalVnd: expectedSubtotal + 18000,
  });
});

test('matchQuizProducts returns accurate top 2-3 products for all 3 goal branches', () => {
  assert.equal(formatVnd(215000), '215.000đ');

  const condomResults = matchQuizProducts({
    goal: 'condom',
    preference: 'snug-49',
    budget: '160-240',
  });
  assert.ok(condomResults.length >= 2 && condomResults.length <= 3);
  assert.equal(condomResults[0].matchLabel, 'Khớp nhất #1');
  assert.equal(condomResults[0].product.id, 'okamoto-harmony');
  assert.ok(condomResults.every((r) => r.product.category === 'condom'));

  const contraceptiveResults = matchQuizProducts({
    goal: 'contraceptive',
    preference: 'emergency-72h',
    budget: 'under-160',
  });
  assert.ok(contraceptiveResults.length >= 2 && contraceptiveResults.length <= 3);
  assert.equal(contraceptiveResults[0].product.id, 'postinor-1');
  assert.ok(contraceptiveResults[0].timingNote);
  assert.ok(
    contraceptiveResults.every((r) => r.product.category === 'contraceptive')
  );

  const enhancementResults = matchQuizProducts({
    goal: 'enhancement',
    preference: 'warm-tingle',
    budget: 'over-240',
  });
  assert.ok(enhancementResults.length >= 2 && enhancementResults.length <= 3);
  assert.equal(enhancementResults[0].product.id, 'durex-intense-gel');
  assert.ok(
    enhancementResults.every(
      (r) =>
        r.product.category === 'enhancement' ||
        r.product.category === 'lubricant'
    )
  );
});

test('clampQuantity and parseQuantityInput enforce 1..99 and recover empty or 0 to 1', () => {
  assert.equal(clampQuantity(0), 1);
  assert.equal(clampQuantity(-5), 1);
  assert.equal(clampQuantity(15), 15);
  assert.equal(clampQuantity(120), 99);
  assert.equal(clampQuantity(Number.NaN), 1);

  assert.equal(parseQuantityInput(''), 1);
  assert.equal(parseQuantityInput('   '), 1);
  assert.equal(parseQuantityInput('0'), 1);
  assert.equal(parseQuantityInput('-3'), 1);
  assert.equal(parseQuantityInput('abc'), 1);
  assert.equal(parseQuantityInput('12'), 12);
  assert.equal(parseQuantityInput('99'), 99);
  assert.equal(parseQuantityInput('250'), 99);
});

test('markOrderCompleted locks status to COMPLETED irreversibly', () => {
  const initialOrders: OrderSnapshot[] = [
    {
      id: 'ord-1',
      orderCode: 'DW-8822',
      otpDigits: '492 - 817',
      deliveryMethod: 'locker',
      lockerLocation: SMART_LOCKER_LOCATIONS[0],
      courierAddressHint: '',
      eWallet: 'Momo',
      totalVnd: 215000,
      readyEstimate: 'Sẵn sàng sau 20 phút',
      itemCount: 1,
      itemsSummary: 'Durex Invisible ×1',
      productIds: [PRODUCTS[0].id],
      createdAtLabel: '23:10',
      status: 'ready',
    },
  ];

  assert.equal(isOrderCompleted(initialOrders[0]), false);

  const completed = markOrderCompleted(initialOrders, 'ord-1', '23:15');
  assert.equal(completed[0].status, 'COMPLETED');
  assert.equal(completed[0].completedAtLabel, '23:15');
  assert.equal(isOrderCompleted(completed[0]), true);

  // Calling again does not toggle back to ready or overwrite completedAtLabel
  const repeated = markOrderCompleted(completed, 'ord-1', '23:20');
  assert.equal(repeated[0].status, 'COMPLETED');
  assert.equal(repeated[0].completedAtLabel, '23:15');
});

test('submitOrderAnonymousReview saves review once into order and product session reviews', () => {
  const order: OrderSnapshot = {
    id: 'ord-2',
    orderCode: 'DW-8823',
    otpDigits: '511 - 209',
    deliveryMethod: 'locker',
    lockerLocation: SMART_LOCKER_LOCATIONS[0],
    courierAddressHint: '',
    eWallet: 'ZaloPay',
    totalVnd: 215000,
    readyEstimate: 'Sẵn sàng sau 20 phút',
    itemCount: 1,
    itemsSummary: 'Durex Invisible ×1',
    productIds: [PRODUCTS[0].id],
    createdAtLabel: '23:10',
    completedAtLabel: '23:16',
    status: 'COMPLETED',
  };

  // Reject invalid 0-star submission
  const invalidAttempt = submitOrderAnonymousReview({
    orders: [order],
    orderId: 'ord-2',
    sessionReviewsByProductId: {},
    rating: 0,
    tags: ['Đóng gói siêu kín'],
    comment: 'Tốt',
    submittedAtLabel: '23:17',
  });
  assert.equal(invalidAttempt.didSubmit, false);

  const submitted = submitOrderAnonymousReview({
    orders: [order],
    orderId: 'ord-2',
    sessionReviewsByProductId: {},
    rating: 5,
    tags: ['Đóng gói siêu kín', 'Lấy tủ OTP mượt'],
    comment: 'Hộp trơn rất kín đáo',
    submittedAtLabel: '23:17',
  });
  assert.equal(submitted.didSubmit, true);
  assert.equal(submitted.orders[0].reviewSubmitted?.rating, 5);
  assert.deepEqual(submitted.orders[0].reviewSubmitted?.tags, [
    'Đóng gói siêu kín',
    'Lấy tủ OTP mượt',
  ]);

  const merged = getMergedProductReviews(
    PRODUCTS[0],
    submitted.sessionReviewsByProductId
  );
  assert.equal(merged.length, PRODUCTS[0].reviews.length + 1);
  assert.equal(merged[0].author, 'Khách ẩn danh');
  assert.equal(
    merged[0].comment,
    'Đóng gói siêu kín · Lấy tủ OTP mượt — Hộp trơn rất kín đáo'
  );

  // Duplicate submission is blocked
  const duplicate = submitOrderAnonymousReview({
    orders: submitted.orders,
    orderId: 'ord-2',
    sessionReviewsByProductId: submitted.sessionReviewsByProductId,
    rating: 4,
    tags: [],
    comment: 'Spam',
    submittedAtLabel: '23:18',
  });
  assert.equal(duplicate.didSubmit, false);
});

test('canConfirmCheckout enforces non-empty courierHint for courier delivery and locker for locker delivery', () => {
  assert.equal(
    canConfirmCheckout({
      deliveryMethod: 'courier',
      selectedLocker: SMART_LOCKER_LOCATIONS[0],
      courierHint: '',
    }),
    false
  );
  assert.equal(
    canConfirmCheckout({
      deliveryMethod: 'courier',
      selectedLocker: SMART_LOCKER_LOCATIONS[0],
      courierHint: '   ',
    }),
    false
  );
  assert.equal(
    canConfirmCheckout({
      deliveryMethod: 'courier',
      selectedLocker: null,
      courierHint: 'Bàn bảo vệ KTX Khu B',
    }),
    true
  );
  assert.equal(
    canConfirmCheckout({
      deliveryMethod: 'locker',
      selectedLocker: null,
      courierHint: 'Bàn bảo vệ',
    }),
    false
  );
  assert.equal(
    canConfirmCheckout({
      deliveryMethod: 'locker',
      selectedLocker: SMART_LOCKER_LOCATIONS[0],
      courierHint: '',
    }),
    true
  );
});

test('deleteSingleOrder removes only target order and countOtherPendingOrders counts remaining ready orders', () => {
  const baseOrder: OrderSnapshot = {
    id: 'ord-a',
    orderCode: 'DW-8801',
    otpDigits: '111 - 222',
    deliveryMethod: 'locker',
    lockerLocation: SMART_LOCKER_LOCATIONS[0],
    courierAddressHint: '',
    eWallet: 'Momo',
    totalVnd: 215000,
    readyEstimate: 'Sẵn sàng sau 20 phút',
    itemCount: 1,
    itemsSummary: 'Durex Invisible ×1',
    createdAtLabel: '20:00',
    status: 'COMPLETED',
  };
  const pendingOrder: OrderSnapshot = {
    ...baseOrder,
    id: 'ord-b',
    orderCode: 'DW-8802',
    otpDigits: '333 - 444',
    status: 'ready',
  };
  const anotherCompleted: OrderSnapshot = {
    ...baseOrder,
    id: 'ord-c',
    orderCode: 'DW-8803',
    status: 'COMPLETED',
  };

  const list = [baseOrder, pendingOrder, anotherCompleted];
  assert.equal(countOtherPendingOrders(list, 'ord-a'), 1);
  assert.equal(countOtherPendingOrders(list, 'ord-b'), 0);

  const afterDelete = deleteSingleOrder(list, 'ord-a');
  assert.deepEqual(
    afterDelete.map((o) => o.id),
    ['ord-b', 'ord-c']
  );
});

test('createInitialQuizState initializes empty questions state cleanly', () => {
  assert.deepEqual(createInitialQuizState(), {
    phase: 'questions',
    stepIndex: 0,
    answers: { goal: '', preference: '', budget: '' },
    results: [],
  });
});

test('filterLockersByDistrict returns all lockers for ALL and narrows to chosen district', () => {
  const all = filterLockersByDistrict(SMART_LOCKER_LOCATIONS, 'ALL');
  assert.equal(all.length, SMART_LOCKER_LOCATIONS.length);

  const q10 = filterLockersByDistrict(SMART_LOCKER_LOCATIONS, 'Q.10');
  assert.ok(q10.length >= 1);
  assert.ok(q10.every((loc) => loc.districtShort === 'Q.10'));
});

test('multi-product order review targets only the chosen product or general order without cloning', () => {
  const multiOrder: OrderSnapshot = {
    id: 'ord-multi',
    orderCode: 'DW-8890',
    otpDigits: '123 - 456',
    deliveryMethod: 'locker',
    lockerLocation: SMART_LOCKER_LOCATIONS[0],
    courierAddressHint: '',
    eWallet: 'Momo',
    totalVnd: 350000,
    readyEstimate: 'Sẵn sàng sau 20 phút',
    itemCount: 2,
    itemsSummary: `${PRODUCTS[0].shortName} ×1, ${PRODUCTS[1].shortName} ×1`,
    productIds: [PRODUCTS[0].id, PRODUCTS[1].id],
    createdAtLabel: '21:00',
    completedAtLabel: '21:15',
    status: 'COMPLETED',
  };

  const targets = getOrderReviewTargets(multiOrder, PRODUCTS);
  assert.equal(targets.length, 2);

  // Choosing a specific product attaches the review ONLY to that product
  const specificResult = submitOrderAnonymousReview({
    orders: [multiOrder],
    orderId: 'ord-multi',
    sessionReviewsByProductId: {},
    rating: 5,
    tags: ['Đúng mô tả'],
    comment: 'Rất mỏng và êm',
    submittedAtLabel: '21:18',
    targetProductId: PRODUCTS[1].id,
    targetProductLabel: PRODUCTS[1].shortName,
  });
  assert.equal(specificResult.didSubmit, true);
  assert.equal(
    (specificResult.sessionReviewsByProductId[PRODUCTS[1].id] ?? []).length,
    1
  );
  assert.equal(
    (specificResult.sessionReviewsByProductId[PRODUCTS[0].id] ?? []).length,
    0
  );
  assert.equal(
    specificResult.orders[0].reviewSubmitted?.targetProductLabel,
    PRODUCTS[1].shortName
  );

  // Choosing ORDER_GENERAL records review on the order without duplicating to every product
  const generalResult = submitOrderAnonymousReview({
    orders: [multiOrder],
    orderId: 'ord-multi',
    sessionReviewsByProductId: {},
    rating: 4,
    tags: ['Đóng gói siêu kín'],
    comment: 'Đóng gói chung rất kỹ',
    submittedAtLabel: '21:19',
    targetProductId: ORDER_GENERAL_REVIEW_TARGET,
  });
  assert.equal(generalResult.didSubmit, true);
  assert.deepEqual(generalResult.sessionReviewsByProductId, {});
  assert.equal(
    generalResult.orders[0].reviewSubmitted?.targetProductId,
    ORDER_GENERAL_REVIEW_TARGET
  );
});

test('formatLockerCompactTitle and formatStep2DeliverySummary produce concise checkout labels', () => {
  const goVapLocker = SMART_LOCKER_LOCATIONS.find(
    (loc) => loc.districtShort === 'Gò Vấp'
  );
  assert.ok(goVapLocker);
  assert.equal(
    formatLockerCompactTitle(goVapLocker),
    'Smart Locker Nguyễn Văn Bảo · Q. Gò Vấp'
  );
  assert.equal(
    formatLockerCompactTitle(SMART_LOCKER_LOCATIONS[0]),
    'Smart Locker ĐH Bách Khoa · Q.10'
  );

  assert.equal(
    formatStep2DeliverySummary({
      deliveryMethod: 'locker',
      selectedLocker: goVapLocker,
      districtFilter: 'ALL',
      courierHint: '',
    }),
    'Smart Locker Nguyễn Văn Bảo · Q. Gò Vấp'
  );

  assert.equal(
    formatStep2DeliverySummary({
      deliveryMethod: 'courier',
      selectedLocker: goVapLocker,
      districtFilter: 'Q.3',
      courierHint: '192 Võ Văn Tần',
    }),
    'Giao thả 30p · Q.3'
  );
});
