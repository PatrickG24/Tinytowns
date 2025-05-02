import create from 'zustand';
import { createShuffledDeck, initializeMarket, refreshMarket } from './logic'; // you need to have these exported
import { buildingPatternCheckers, getSelectedResourceGridString } from './logic';

export const useTownStore = create((set, get) => ({
  grid: Array.from({ length: 4 }, () => Array(4).fill(null)),
  selectedResource: null,
  deck: [],
  market: [],
  selectedMarketIndex: null,
  selectedBuilding: null,

  selectBuilding: (building) => set({ selectedBuilding: building }),


  selectResource: (resource, index) => set({
    selectedResource: resource,
    selectedMarketIndex: index
  }),
  

  placeResource: (row, col) => {
    const { selectedResource, grid, deck, market } = get();
    if (!selectedResource || grid[row][col]) return;

    const newGrid = grid.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? selectedResource : cell))
    );

    const { deck: updatedDeck, market: updatedMarket } = refreshMarket(deck, market, selectedResource);

    set({
      grid: newGrid,
      deck: updatedDeck,
      market: updatedMarket,
      selectedResource: null,
      selectedMarketIndex: null, // ✅ reset selection
    });
  },

  resetGame: () => {
    const newDeck = createShuffledDeck();
    const newMarket = initializeMarket(newDeck);
    set({
      grid: Array.from({ length: 4 }, () => Array(4).fill(null)),
      selectedResource: null,
      selectedMarketIndex: null,
      deck: newDeck,
      market: newMarket,
    });
  },

  initDeckAndMarket: () => {
    const newDeck = createShuffledDeck();
    const newMarket = initializeMarket(newDeck);
    set({ deck: newDeck, market: newMarket });
  },

selectedCells: {},

toggleCell: (row, col) =>
  set((state) => {
    const key = `${row},${col}`;
    const updated = { ...state.selectedCells };
    if (updated[key]) {
      delete updated[key];
    } else {
      updated[key] = true;
    }
    return { selectedCells: updated };
  }),

clearSelection: () => set({ selectedCells: {} }),

placeBuilding: (row, col) => {
  const {
    grid,
    selectedBuilding,
    selectedCells,
    clearSelection,
    setGrid,
  } = get();

  if (!selectedBuilding || !selectedCells[`${row},${col}`]) return;

  const patternMatchFn = buildingPatternCheckers[selectedBuilding];
  if (!patternMatchFn) return;

  const resourceString = getSelectedResourceGridString(grid, selectedCells);
  const isValid = patternMatchFn(resourceString);

  if (!isValid) {
    console.log("Invalid pattern for", selectedBuilding);
    return;
  }

  const newGrid = grid.map((r) => [...r]);

  // Clear all selected cells
  Object.keys(selectedCells).forEach((key) => {
    const [r, c] = key.split(",").map(Number);
    newGrid[r][c] = null;
  });

  // Place building on the target cell
  newGrid[row][col] = selectedBuilding.toLowerCase();

  set({ grid: newGrid });
  clearSelection();
  set({ selectedBuilding: null });
},






selectedCells: {},

toggleCell: (row, col) =>
  set((state) => {
    const key = `${row},${col}`;
    const updated = { ...state.selectedCells };
    if (updated[key]) {
      delete updated[key];
    } else {
      updated[key] = true;
    }
    return { selectedCells: updated };
  }),

clearSelection: () => set({ selectedCells: {} }),

placeBuilding: (row, col) => {
  const {
    grid,
    selectedBuilding,
    selectedCells,
    clearSelection,
    setGrid,
  } = get();

  if (!selectedBuilding || !selectedCells[`${row},${col}`]) return;

  const patternMatchFn = buildingPatternCheckers[selectedBuilding];
  if (!patternMatchFn) return;

  const resourceString = getSelectedResourceGridString(grid, selectedCells);
  const isValid = patternMatchFn(resourceString);

  if (!isValid) {
    console.log("Invalid pattern for", selectedBuilding);
    return;
  }

  const newGrid = grid.map((r) => [...r]);

  // Clear all selected cells
  Object.keys(selectedCells).forEach((key) => {
    const [r, c] = key.split(",").map(Number);
    newGrid[r][c] = null;
  });

  // Place building on the target cell
  newGrid[row][col] = selectedBuilding.toLowerCase();

  set({ grid: newGrid });
  clearSelection();
  set({ selectedBuilding: null });
},


}));


