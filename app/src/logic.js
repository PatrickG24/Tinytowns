// logic.js (or deck.js)

// Creates a shuffled deck of resources
export function createShuffledDeck() {
  const resources = ["wood", "stone", "brick", "wheat", "glass"];
  let deck = [];

  for (let i = 0; i < 3; i++) {
    deck.push(...resources);
  }

  // Fisher-Yates Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

// Draws 3 resources from the top of the deck to form the initial market
export function initializeMarket(deck) {
  if (deck.length < 3) throw new Error("Deck does not have enough cards to initialize market");

  const market = deck.splice(0, 3);
  return market;
}

// After placing a resource, refresh the market
export function refreshMarket(deck, market, placedResource) {
  const newMarket = [...market];
  const index = newMarket.indexOf(placedResource);

  if (index !== -1) {
    newMarket.splice(index, 1); // remove only the first found copy
  } else {
    console.warn(`Placed resource ${placedResource} not found in market.`);
  }

  deck.push(placedResource); // Put the placed resource at bottom of deck

  if (deck.length > 0 && newMarket.length < 3) {
    newMarket.push(deck.shift()); // Refill to 3 cards
  }

  return { deck, market: newMarket };
}


export function getSelectedResourceGridString(grid, selectedCells, factoryContents) {
  const keys = Object.keys(selectedCells);
  if (keys.length === 0) return "";

  const rows = [];
  const cols = [];

  keys.forEach(key => {
    const [row, col] = key.split(',').map(Number);
    rows.push(row);
    cols.push(col);
  });

  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);

  let result = "";

  for (let row = minRow; row <= maxRow; row++) {
    if (row !== minRow) result += "|";
    for (let col = minCol; col <= maxCol; col++) {
      const key = `${row},${col}`;
      if (selectedCells[key]) {
        const cellValue = grid[row][col];
        const isFactoryWithContent = cellValue === 'factory' && factoryContents[key];
        result += isFactoryWithContent ? '.' : (cellValue || '.');
      } else {
        result += ".";
      }
    }
  }

  return result;
}


export const buildingPatternCheckers = {
  Farm: (str) =>
    [
      "wheatwheat|woodwood",
      "woodwood|wheatwheat",
      "wheatwood|wheatwood",
      "woodwheat|woodwheat",
    ].includes(str),

  Well: (str) =>
    [
      "woodstone",
      "stonewood",
      "wood|stone",
      "stone|wood",
    ].includes(str),

  Theater: (str) =>
    [
      "woodglasswood|.stone.",
      ".stone.|woodglasswood",
      "wood.|glassstone|wood.",
      ".wood|stoneglass|.wood",
    ].includes(str),

  Tavern: (str) =>
    [
      "brickbrickwood",
      "woodbrickbrick",
      "brick|brick|wood",
      "wood|brick|brick",
    ].includes(str),

  Chapel: (str) =>
    [
      "..glass|stoneglassstone",
      "stoneglassstone|..glass",
      "glass..|stoneglassstone",
      "stoneglassstone|glasss..",
      "stoneglasss|glasss.|stone.",
      "glassstone|.glass|.stone",
      "stone.|glass.|stoneglass",
      ".stone|.glass|glassstone",
    ].includes(str),

  Factory: (str) =>
    [
      "wood...|brickstonestonebrick",
      "brickstonestonebrick|wood...",
      "...wood|brickstonestonebrick",
      "brickstonestonebrick|...wood",
      "brickwood|stone.|stone.|wood.",
      "wood.|stone.|stone.|brickwood",
      "woodbrick|.stone|.stone|.brick",
      ".brick|.stone|.stone|woodbrick",
    ].includes(str),

  Cottage: (str) =>
    [
      ".wheat|brickglass",
      "brickglass|.wheat",
      "wheat.|glassbrick",
      "glassbrick|wheat.",
      "brick.|glasswheat",
      "glasswheat|brick.",
      ".brick|wheatglass",
      "wheatglass|.brick",
    ].includes(str),

  "Cathedral of Catarina": (str) =>
    [
      ".wheat|stoneglass",
      "stoneglass|.wheat",
      "wheat.|glassstone",
      "glassstone|wheat.",
      "stone.|glasswheat",
      "glasswheat|stone.",
      ".stone|wheatglass",
      "wheatglass|.stone",
    ].includes(str),
};

export function calculateScore(grid) {
  let score = 0;
  let hasCathedral = false;
  let emptySpaces = 0;

  for (let row of grid) {
    for (let cell of row) {
      if (!cell) {
        emptySpaces++;
        continue;
      }

      switch (cell) {
        case 'cottage':
          score += 3; // Example: Cottage = 3 points
          break;
        case 'cathedral':
          score += 2; // Cathedral = 2 points + zero penalty for empty spaces
          hasCathedral = true;
          break;
        // Add other buildings here if needed
        default:
          break;
      }
    }
  }

  if (!hasCathedral) {
    score -= emptySpaces; // -1 point for each empty space if no Cathedral
  }

  return score;
}

