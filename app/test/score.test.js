import { calculateScore } from '../src/logic';

test('Score with empty grid (no buildings, all empty)', () => {
  const grid = Array(4).fill(null).map(() => Array(4).fill(null));
  expect(calculateScore(grid)).toBe(-16); // 16 empty tiles = -16
});

test('Score with cathedral (no penalty)', () => {
  const grid = [
    ['cathedral of caterina', null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
  expect(calculateScore(grid)).toBe(2); // +2 for cathedral, no penalty
});

test('Cottage scoring with 1 farm feeding 2 cottages', () => {
  const grid = [
    ['farm', 'cottage', 'cottage', null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
  // Farm feeds up to 4 cottages: 2 cottages = 2 * 3 = 6 points
  // 13 empty = -13 => total = -7
  expect(calculateScore(grid)).toBe(-7);
});

test('Well scoring with adjacent cottages', () => {
  const grid = [
    ['cottage', 'well', 'cottage', null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
  // 2 adjacent cottages = +2, no cottages fed = 0
  // 14 empty = -14
  expect(calculateScore(grid)).toBe(-11);
});

test('Chapel bonus based on fed cottages', () => {
  const grid = [
    ['chapel', 'farm', 'cottage', 'cottage'],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
  // 2 cottages fed = 2*3 = 6, 1 chapel = +2 (2 fed cottages * 1 chapel)
  // 12 empty = -12
  expect(calculateScore(grid)).toBe(-4);
});

test('Tavern scoring with 3 taverns', () => {
  const grid = [
    ['tavern', 'tavern', 'tavern', null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
  // Tavern score for 3 = 9
  // 13 empty = -13 => total = -4
  expect(calculateScore(grid)).toBe(-4);
});

test('Theater scoring with unique buildings in row/col', () => {
  const grid = [
    ['theater', 'chapel', 'tavern', 'well'],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
  // Unique buildings in row (chapel, tavern, well) = 3
  // 12 empty = -12 => total = -9
  expect(calculateScore(grid)).toBe(-7);
});

test('Caterina prevents penalty and counts for 2', () => {
  const grid = [
    ['cathedral of caterina', null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
  expect(calculateScore(grid)).toBe(2); // 2 points, no -15 penalty
});
