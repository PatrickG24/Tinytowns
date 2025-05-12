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

test('Theater matches pattern woodglasswood|.stone.', () => {
  expect(buildingPatternCheckers.Theater('woodglasswood|.stone.')).toBe(true);
});
test('Theater matches pattern .stone.|woodglasswood', () => {
  expect(buildingPatternCheckers.Theater('.stone.|woodglasswood')).toBe(true);
});
test('Theater matches pattern wood.|glassstone|wood.', () => {
  expect(buildingPatternCheckers.Theater('wood.|glassstone|wood.')).toBe(true);
});
test('Theater matches pattern .wood|stoneglass|.wood', () => {
  expect(buildingPatternCheckers.Theater('.wood|stoneglass|.wood')).toBe(true);
});

test('Tavern matches pattern brickbrickglass', () => {
  expect(buildingPatternCheckers.Tavern('brickbrickglass')).toBe(true);
});
test('Tavern matches pattern glassbrickbrick', () => {
  expect(buildingPatternCheckers.Tavern('glassbrickbrick')).toBe(true);
});
test('Tavern matches pattern brick|brick|glass', () => {
  expect(buildingPatternCheckers.Tavern('brick|brick|glass')).toBe(true);
});
test('Tavern matches pattern glass|brick|brick', () => {
  expect(buildingPatternCheckers.Tavern('glass|brick|brick')).toBe(true);
});

test('Chapel matches pattern ..glass|stoneglassstone', () => {
  expect(buildingPatternCheckers.Chapel('..glass|stoneglassstone')).toBe(true);
});
test('Chapel matches pattern stoneglassstone|..glass', () => {
  expect(buildingPatternCheckers.Chapel('stoneglassstone|..glass')).toBe(true);
});
test('Chapel matches pattern glass..|stoneglassstone', () => {
  expect(buildingPatternCheckers.Chapel('glass..|stoneglassstone')).toBe(true);
});
test('Chapel matches pattern stoneglassstone|glasss..', () => {
  expect(buildingPatternCheckers.Chapel('stoneglassstone|glasss..')).toBe(true);
});
test('Chapel matches pattern stoneglasss|glasss.|stone.', () => {
  expect(buildingPatternCheckers.Chapel('stoneglasss|glasss.|stone.')).toBe(true);
});
test('Chapel matches pattern glassstone|.glass|.stone', () => {
  expect(buildingPatternCheckers.Chapel('glassstone|.glass|.stone')).toBe(true);
});
test('Chapel matches pattern stone.|glass.|stoneglass', () => {
  expect(buildingPatternCheckers.Chapel('stone.|glass.|stoneglass')).toBe(true);
});
test('Chapel matches pattern .stone|.glass|glassstone', () => {
  expect(buildingPatternCheckers.Chapel('.stone|.glass|glassstone')).toBe(true);
});

test('Cottage matches .wheat|brickglass', () => {
  expect(buildingPatternCheckers.Cottage('.wheat|brickglass')).toBe(true);
});
test('Cottage matches brickglass|.wheat', () => {
  expect(buildingPatternCheckers.Cottage('brickglass|.wheat')).toBe(true);
});
test('Cottage matches wheat.|glassbrick', () => {
  expect(buildingPatternCheckers.Cottage('wheat.|glassbrick')).toBe(true);
});
test('Cottage matches glassbrick|wheat.', () => {
  expect(buildingPatternCheckers.Cottage('glassbrick|wheat.')).toBe(true);
});
test('Cottage matches brick.|glasswheat', () => {
  expect(buildingPatternCheckers.Cottage('brick.|glasswheat')).toBe(true);
});
test('Cottage matches glasswheat|brick.', () => {
  expect(buildingPatternCheckers.Cottage('glasswheat|brick.')).toBe(true);
});
test('Cottage matches .brick|wheatglass', () => {
  expect(buildingPatternCheckers.Cottage('.brick|wheatglass')).toBe(true);
});
test('Cottage matches wheatglass|.brick', () => {
  expect(buildingPatternCheckers.Cottage('wheatglass|.brick')).toBe(true);
});

test('Cathedral matches .wheat|stoneglass', () => {
  expect(buildingPatternCheckers['Cathedral of Caterina']('.wheat|stoneglass')).toBe(true);
});
test('Cathedral matches stoneglass|.wheat', () => {
  expect(buildingPatternCheckers['Cathedral of Caterina']('stoneglass|.wheat')).toBe(true);
});
test('Cathedral matches wheat.|glassstone', () => {
  expect(buildingPatternCheckers['Cathedral of Caterina']('wheat.|glassstone')).toBe(true);
});
test('Cathedral matches glassstone|wheat.', () => {
  expect(buildingPatternCheckers['Cathedral of Caterina']('glassstone|wheat.')).toBe(true);
});
test('Cathedral matches stone.|glasswheat', () => {
  expect(buildingPatternCheckers['Cathedral of Caterina']('stone.|glasswheat')).toBe(true);
});
test('Cathedral matches glasswheat|stone.', () => {
  expect(buildingPatternCheckers['Cathedral of Caterina']('glasswheat|stone.')).toBe(true);
});
test('Cathedral matches .stone|wheatglass', () => {
  expect(buildingPatternCheckers['Cathedral of Caterina']('.stone|wheatglass')).toBe(true);
});
test('Cathedral matches wheatglass|.stone', () => {
  expect(buildingPatternCheckers['Cathedral of Caterina']('wheatglass|.stone')).toBe(true);
});
