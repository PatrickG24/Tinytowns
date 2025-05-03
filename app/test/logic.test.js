import { createShuffledDeck, initializeMarket, refreshMarket } from '../src/logic';

test('createShuffledDeck returns 15 cards', () => {
  const deck = createShuffledDeck();
  expect(deck.length).toBe(15);
});

test('initializeMarket removes 3 cards from deck', () => {
  const deck = createShuffledDeck();
  const market = initializeMarket(deck);
  expect(market.length).toBe(3);
  expect(deck.length).toBe(12);
});

test('refreshMarket refills the market after placing a resource', () => {
  let deck = ["stone", "glass", "wheat"];
  let market = ["wood", "brick", "wheat"];
  const { deck: newDeck, market: newMarket } = refreshMarket(deck, market, "brick");

  expect(newMarket.length).toBe(3);
  expect(newDeck.length).toBe(3);
});

import {
  getSelectedResourceGridString,
  buildingPatternCheckers,
} from '../src/logic';

test('getSelectedResourceGridString returns correct pattern', () => {
  const grid = [
    ['wheat', 'wheat', null, null],
    ['wood', 'wood', null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];

  const selectedCells = {
    '0,0': true, '0,1': true,
    '1,0': true, '1,1': true,
  };

  const result = getSelectedResourceGridString(grid, selectedCells);
  expect(result).toBe('wheatwheat|woodwood');
});

test('Farm pattern is valid for wheatwheat|woodwood', () => {
  const str = 'wheatwheat|woodwood';
  const isMatch = buildingPatternCheckers.Farm(str);
  expect(isMatch).toBe(true);
});

test('Farm pattern fails for wheatglass|woodwood', () => {
  const str = 'wheatglass|woodwood';
  const isMatch = buildingPatternCheckers.Farm(str);
  expect(isMatch).toBe(false);
});

test('Well matches woodstone and stonewood patterns', () => {
  expect(buildingPatternCheckers.Well('woodstone')).toBe(true);
  expect(buildingPatternCheckers.Well('stonewood')).toBe(true);
});

test('Factory pattern fails for mismatched layout', () => {
  const badFactory = 'glass...|brickstonestonebrick';
  expect(buildingPatternCheckers.Factory(badFactory)).toBe(false);
});
