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
      "brickbrickglass",
      "glassbrickbrick",
      "brick|brick|glass",
      "glass|brick|brick",
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

  "Cathedral of Caterina": (str) =>
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

  const buildingCounts = {};
  const cottagePositions = [];
  const theaterPositions = [];

  const allResources = ['wood', 'stone', 'brick', 'wheat', 'glass'];

  // Pass 1: Count and collect positions
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];

      if (!cell || allResources.includes(cell)) {
        emptySpaces++;
        continue;
      }

      buildingCounts[cell] = (buildingCounts[cell] || 0) + 1;

      if (cell === 'cathedral of caterina') {
        hasCathedral = true;
        score += 2;
      }

      if (cell === 'cottage') {
        cottagePositions.push({ row, col });
      }

      if (cell === 'theater') {
        theaterPositions.push({ row, col });
      }
    }
  }

  // 🏠 Cottages (fed only)
  const totalFarms = buildingCounts['farm'] || 0;
  const maxFedCottages = totalFarms * 4;
  const fedCottages = cottagePositions.slice(0, maxFedCottages);
  score += fedCottages.length * 3;

  // ⛪ Chapel: +1 per fed cottage PER chapel
  const chapelCount = buildingCounts['chapel'] || 0;
  score += chapelCount * fedCottages.length;


  // 💧 Wells (adjacent to cottages)
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 'well') {
        const neighbors = [
          [row - 1, col],
          [row + 1, col],
          [row, col - 1],
          [row, col + 1],
        ];
        let adjacentCottages = 0;
        for (const [r, c] of neighbors) {
          if (
            r >= 0 && r < grid.length &&
            c >= 0 && c < grid[0].length &&
            grid[r][c] === 'cottage'
          ) {
            adjacentCottages++;
          }
        }
        score += Math.min(adjacentCottages, 4);
      }
    }
  }

  // 🎭 Theater
  for (const { row, col } of theaterPositions) {
    const uniqueBuildings = new Set();

    for (let c = 0; c < grid[row].length; c++) {
      const val = grid[row][c];
      if (val && val !== 'theater' && !allResources.includes(val)) {
        uniqueBuildings.add(val);
      }
    }

    for (let r = 0; r < grid.length; r++) {
      const val = grid[r][col];
      if (val && val !== 'theater' && !allResources.includes(val)) {
        uniqueBuildings.add(val);
      }
    }

    score += uniqueBuildings.size;
  }

  // 🍻 Tavern scoring
  const tavernCount = buildingCounts['tavern'] || 0;
  const tavernScores = [0, 2, 5, 9, 14, 20]; // index = tavern count
  score += tavernScores[Math.min(tavernCount, 5)];


  // ⛔ Empty tile penalty (resource tiles count as empty)
  if (!hasCathedral) {
    score -= emptySpaces;
  }

  return score;
}


// export function calculateScore(grid) {
//   let score = 0;
//   let hasCathedral = false;
//   let emptySpaces = 0;

//   const buildingCounts = {};
//   const cottagePositions = [];
//   const theaterPositions = [];

//   const allResources = ['wood', 'stone', 'brick', 'wheat', 'glass'];

//   // Pass 1: Count and collect positions
//   for (let row = 0; row < grid.length; row++) {
//     for (let col = 0; col < grid[row].length; col++) {
//       const cell = grid[row][col];

//       if (!cell || allResources.includes(cell)) {
//         emptySpaces++;
//         continue;
//       }

//       buildingCounts[cell] = (buildingCounts[cell] || 0) + 1;

//       if (cell === 'cathedral of caterina') {
//         hasCathedral = true;
//         score += 2;
//       }

//       if (cell === 'cottage') {
//         cottagePositions.push({ row, col });
//       }

//       if (cell === 'theater') {
//         theaterPositions.push({ row, col });
//       }
//     }
//   }

//   // Cottages (fed only)
//   const totalFarms = buildingCounts['farm'] || 0;
//   const maxFedCottages = totalFarms * 4;
//   const fedCottages = cottagePositions.slice(0, maxFedCottages);
//   score += fedCottages.length * 3;

//   // Wells (adjacent to cottages)
//   for (let row = 0; row < grid.length; row++) {
//     for (let col = 0; col < grid[row].length; col++) {
//       if (grid[row][col] === 'well') {
//         const neighbors = [
//           [row - 1, col],
//           [row + 1, col],
//           [row, col - 1],
//           [row, col + 1],
//         ];
//         let adjacentCottages = 0;
//         for (const [r, c] of neighbors) {
//           if (
//             r >= 0 && r < grid.length &&
//             c >= 0 && c < grid[0].length &&
//             grid[r][c] === 'cottage'
//           ) {
//             adjacentCottages++;
//           }
//         }
//         score += Math.min(adjacentCottages, 4);
//       }
//     }
//   }

//   // Theater scoring
//   for (const { row, col } of theaterPositions) {
//     const uniqueBuildings = new Set();

//     // Same row
//     for (let c = 0; c < grid[row].length; c++) {
//       const val = grid[row][c];
//       if (val && val !== 'theater' && !allResources.includes(val)) {
//         uniqueBuildings.add(val);
//       }
//     }

//     // Same column
//     for (let r = 0; r < grid.length; r++) {
//       const val = grid[r][col];
//       if (val && val !== 'theater' && !allResources.includes(val)) {
//         uniqueBuildings.add(val);
//       }
//     }

//     score += uniqueBuildings.size;
//   }

//   // Tavern scoring
//   const tavernCount = buildingCounts['tavern'] || 0;
//   const tavernScores = [0, 2, 5, 9, 14, 20]; // index = number of taverns
//   score += tavernScores[Math.min(tavernCount, 5)];

//   // Empty space penalty unless cathedral is built
//   if (!hasCathedral) {
//     score -= emptySpaces;
//   }

//   return score;
// }



