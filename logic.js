// logic.js

// 1. Building pattern definitions
export const buildingPatterns = {
  Farm: { 
    pattern: [
      ['yellow', 'yellow'],
      ['brown', 'brown']
    ]
  },
  Well: {
    pattern: [
      ['brown', 'grey']
    ]
  },
  'Cathedral of Catarina': {
    pattern: [
      ['yellow', 'grey'],
      ['blue', 'yellow']
    ]
  },
  Theater: {
    pattern: [
      ['grey', 'brown', 'blue'],
      ['brown', 'grey', 'blue']
    ]
  },
  Tavern: {
    pattern: [
      ['red', 'red', 'brown']
    ]
  },
  Chapel: {
    pattern: [
      ['blue', 'grey'],
      ['blue', 'grey']
    ]
  },
  Factory: {
    pattern: [
      ['brown', 'red', 'grey', 'grey'],
      ['red', 'brown', 'grey', 'red']
    ]
  },
};

// 2. Rotate a 2D pattern 90° clockwise
function rotatePattern(pattern) {
  const R = pattern.length, C = pattern[0].length;
  const out = Array.from({ length: C }, () => Array(R).fill(null));
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      out[c][R - 1 - r] = pattern[r][c];
    }
  }
  return out;
}

// 3. Check if a building can be placed at (row, col) in any rotation
export function canPlaceBuilding(grid, name, row, col) {
  const def = buildingPatterns[name];
  if (!def) return false;

  let pat = def.pattern;
  for (let rot = 0; rot < 4; rot++) {
    const R = pat.length, C = pat[0].length, N = grid.length;
    // bounds
    if (row + R <= N && col + C <= N) {
      let ok = true;
      for (let r = 0; r < R && ok; r++) {
        for (let c = 0; c < C; c++) {
          if (grid[row + r][col + c] !== pat[r][c]) {
            ok = false;
            break;
          }
        }
      }
      if (ok) return true;
    }
    pat = rotatePattern(pat);
  }
  return false;
}

// 4. Flatten and sort a 2D pattern to 1D array
function flattenAndSort(pattern) {
  return pattern.flat().sort();
}

// 5. Validate a set of selected resource strings against a building pattern
export function isValidResourcePattern(buildingName, selectedResources) {
  const def = buildingPatterns[buildingName];
  if (!def) return false;

  const expected = flattenAndSort(def.pattern);
  const actual = [...selectedResources].sort();

  return JSON.stringify(expected) === JSON.stringify(actual);
}
