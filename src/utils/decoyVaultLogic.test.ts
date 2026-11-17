import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_VAULT_PIN,
  addWaterLog,
  calculateGoalProgress,
  calculateTotalIntakeMl,
  createInitialHabits,
  isValidFourDigitPin,
  removeWaterLogById,
  subtractWaterFromLogs,
  toggleHabitById,
  updateWaterLogLabel,
  verifyVaultPin,
} from './decoyVaultLogic';

test('initial habits start completely unchecked and toggle independently', () => {
  const initial = createInitialHabits();
  assert.ok(initial.length >= 3);
  assert.ok(initial.every((h) => h.completed === false));

  const afterToggle = toggleHabitById(initial, initial[0].id);
  assert.equal(afterToggle[0].completed, true);
  assert.equal(afterToggle[1].completed, false);

  const afterUntoggle = toggleHabitById(afterToggle, initial[0].id);
  assert.equal(afterUntoggle[0].completed, false);
});

test('water logs support adding, subtracting without negative values, editing, and deleting', () => {
  let logs = addWaterLog([], 250, '09:15', 'log-1');
  logs = addWaterLog(logs, 500, '11:30', 'log-2');
  assert.equal(logs.length, 2);
  assert.equal(calculateTotalIntakeMl(logs), 750);

  // Subtract 250ml reduces the latest 500ml log to 250ml
  logs = subtractWaterFromLogs(logs, 250);
  assert.equal(calculateTotalIntakeMl(logs), 500);
  assert.equal(logs[0].amountMl, 250);

  // Edit note label
  logs = updateWaterLogLabel(logs, 'log-1', 'Ly nước buổi sáng');
  assert.equal(logs.find((l) => l.id === 'log-1')?.label, 'Ly nước buổi sáng');

  // Empty label edit is ignored
  logs = updateWaterLogLabel(logs, 'log-1', '   ');
  assert.equal(logs.find((l) => l.id === 'log-1')?.label, 'Ly nước buổi sáng');

  // Remove a log entry subtracts its ml
  logs = removeWaterLogById(logs, 'log-2');
  assert.equal(calculateTotalIntakeMl(logs), 250);

  // Subtracting more than remaining clamps cleanly to 0ml
  logs = subtractWaterFromLogs(logs, 500);
  assert.equal(logs.length, 0);
  assert.equal(calculateTotalIntakeMl(logs), 0);

  // Subtracting from empty stays empty
  logs = subtractWaterFromLogs(logs, 250);
  assert.equal(calculateTotalIntakeMl(logs), 0);
});

test('goal progress adapts cleanly to 1500 / 2000 / 2500ml targets', () => {
  assert.deepEqual(calculateGoalProgress(750, 1500), {
    pct: 50,
    remainingMl: 750,
    reached: false,
  });
  assert.deepEqual(calculateGoalProgress(2000, 1500), {
    pct: 100,
    remainingMl: 0,
    reached: true,
  });
  assert.deepEqual(calculateGoalProgress(0, 2500), {
    pct: 0,
    remainingMl: 2500,
    reached: false,
  });
});

test('vault PIN validation and verification enforce strict 4-digit codes', () => {
  assert.equal(DEFAULT_VAULT_PIN, '2468');
  assert.equal(isValidFourDigitPin('2468'), true);
  assert.equal(isValidFourDigitPin('246'), false);
  assert.equal(isValidFourDigitPin('24ab'), false);

  assert.equal(verifyVaultPin('2468', DEFAULT_VAULT_PIN), true);
  assert.equal(verifyVaultPin('1111', DEFAULT_VAULT_PIN), false);
  assert.equal(verifyVaultPin('246', DEFAULT_VAULT_PIN), false);
  assert.equal(verifyVaultPin('1357', '1357'), true);
});
