import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TUTORIAL_STEPS,
  TUTORIAL_STEP_COUNT,
  computeTutorialOverlayLayout,
  createTutorialSandboxCart,
  createTutorialSandboxOrder,
} from './tutorialLogic';

test('TUTORIAL_STEPS strictly enforces 6 ultra-concise steps across real screens', () => {
  assert.equal(TUTORIAL_STEP_COUNT, 6);
  assert.deepEqual(
    TUTORIAL_STEPS.map((s) => s.screen),
    [
      'guest-home',
      'guest-home',
      'checkout',
      'checkout',
      'otp-pickup',
      'otp-pickup',
    ]
  );

  for (const step of TUTORIAL_STEPS) {
    // Strip leading "N." and "&" when counting Vietnamese words for the 4-word title cap
    const titleWords = step.title
      .replace(/^\d+\.\s*/, '')
      .split(/\s+/)
      .filter((w) => w && w !== '&');
    assert.ok(
      titleWords.length <= 4,
      `Step "${step.id}" title has ${titleWords.length} words (expected <= 4): ${step.title}`
    );

    const descWords = step.description.trim().split(/\s+/).filter(Boolean);
    assert.ok(
      descWords.length <= 12,
      `Step "${step.id}" description has ${descWords.length} words (expected <= 12): ${step.description}`
    );
  }
});

test('createTutorialSandboxCart and createTutorialSandboxOrder generate deterministic demo data', () => {
  const demoCart = createTutorialSandboxCart();
  assert.equal(demoCart.length, 1);
  assert.equal(demoCart[0].quantity, 1);

  const demoOrder = createTutorialSandboxOrder();
  assert.equal(demoOrder.orderCode, 'DW-8899');
  assert.equal(demoOrder.otpDigits, '628 - 419');
  assert.equal(demoOrder.status, 'ready');
  assert.equal(demoOrder.deliveryMethod, 'locker');
});

test('computeTutorialOverlayLayout keeps tooltip inside container and gates arrow on clean clearance', () => {
  // Target near bottom-right on desktop (e.g. quick-add button)
  const desktopBottom = computeTutorialOverlayLayout({
    left: 760,
    top: 620,
    width: 110,
    height: 44,
    containerW: 1152,
    containerH: 846,
  });
  assert.equal(desktopBottom.placement, 'above');
  assert.equal(desktopBottom.showArrow, true);
  assert.ok(desktopBottom.arrowEndY > desktopBottom.arrowStartY);
  assert.ok(desktopBottom.tooltipLeft >= 12);
  assert.ok(desktopBottom.tooltipLeft + desktopBottom.tooltipWidth <= 1152 - 12);
  assert.ok(desktopBottom.tooltipTop >= 12);
  assert.ok(desktopBottom.arrowPathD.startsWith('M '));

  // Target near top-right on mobile (e.g. panic button)
  const mobileTop = computeTutorialOverlayLayout({
    left: 250,
    top: 10,
    width: 120,
    height: 42,
    containerW: 390,
    containerH: 844,
  });
  assert.equal(mobileTop.placement, 'below');
  assert.equal(mobileTop.showArrow, true);
  assert.ok(mobileTop.arrowEndY < mobileTop.arrowStartY);
  assert.ok(mobileTop.tooltipLeft >= 12);
  assert.ok(mobileTop.tooltipLeft + mobileTop.tooltipWidth <= 390 - 12);
  assert.ok(mobileTop.tooltipTop > 52);

  // Tall target on mobile leaves no safe gap -> hides arrow instead of inverting it
  const tallTarget = computeTutorialOverlayLayout({
    left: 14,
    top: 160,
    width: 362,
    height: 580,
    containerW: 390,
    containerH: 844,
  });
  assert.equal(tallTarget.showArrow, false);

  // Tall left-column target on desktop uses right-side placement with horizontal arrow
  const desktopTallLeft = computeTutorialOverlayLayout({
    left: 14,
    top: 160,
    width: 620,
    height: 620,
    containerW: 1152,
    containerH: 846,
  });
  assert.equal(desktopTallLeft.placement, 'right');
  assert.equal(desktopTallLeft.showArrow, true);
  assert.ok(desktopTallLeft.tooltipLeft >= 14 + 620 + 24);
  assert.ok(desktopTallLeft.arrowEndX < desktopTallLeft.arrowStartX);
});
