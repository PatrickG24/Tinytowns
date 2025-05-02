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
