import create from 'zustand';
import { createShuffledDeck, initializeMarket, refreshMarket, calculateScore as calculateScoreLogic } from './logic'; // you need to have these exported
import { buildingPatternCheckers, getSelectedResourceGridString } from './logic';

export const useTownStore = create((set, get) => ({
  grid: Array.from({ length: 4 }, () => Array(4).fill(null)),
  selectedResource: null,
  deck: [],
  market: [],
  selectedMarketIndex: null,
  selectedBuilding: null,
  factoryContents: {}, // key = "row,col", value = resource (e.g., "glass")
  overrideOptions: null, // List of alternative resources
  overrideLocked: false,

  selectBuilding: (building) => set({ selectedBuilding: building }),
  selectResource: (resource, index) => {
    const { factoryContents, overrideOptions, overrideLocked } = get();
  
    // 🚫 Prevent selecting a new resource while override is locked
    if (overrideOptions || overrideLocked) return;
  
    const isFactoryMatch = Object.values(factoryContents).includes(resource);
  
    if (isFactoryMatch) {
      set({ overrideOptions: ["wood", "stone", "brick", "wheat", "glass"], selectedMarketIndex: index });
    } else {
      set({ selectedResource: resource, selectedMarketIndex: index });
    }
  },

  calculateScore: () => {
    const grid = get().grid;
    return calculateScoreLogic(grid);
  },
  
  

  // chooseOverrideResource: (resource) => {
  //   set({ selectedResource: resource, overrideOptions: null });
  // },
  chooseOverrideResource: (override) => {
    const { market, selectedMarketIndex, deck } = get();
    const original = market[selectedMarketIndex];
  
    const { deck: updatedDeck, market: updatedMarket } = refreshMarket(deck, market, original);
  
    set({
      selectedResource: override,
      overrideOptions: null,
      selectedMarketIndex: null,
      deck: updatedDeck,
      market: updatedMarket,
      overrideLocked: true,  // 🚫 Lock new selections
    });
  },
  
  
  placeResource: (row, col) => {
    const { selectedResource, grid, deck, market, factoryContents } = get();
    if (!selectedResource) return;
  
    const cellContent = grid[row][col];
    const key = `${row},${col}`;
  
    // ✅ Placing into a factory
    if (cellContent === 'factory' && !factoryContents[key]) {
      const newFactoryContents = { ...factoryContents, [key]: selectedResource };
      const { deck: updatedDeck, market: updatedMarket } = refreshMarket(deck, market, selectedResource);
  
      set({
        factoryContents: newFactoryContents,
        deck: updatedDeck,
        market: updatedMarket,
        selectedResource: null,
        selectedMarketIndex: null,
        overrideLocked: false, // ✅ Unlock after placement
      });
  
      return;
    }
  
    // ✅ Regular placement into empty cell
    if (!grid[row][col]) {
      const newGrid = grid.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? selectedResource : cell))
      );
  
      const { deck: updatedDeck, market: updatedMarket } = refreshMarket(deck, market, selectedResource);
  
      set({
        grid: newGrid,
        deck: updatedDeck,
        market: updatedMarket,
        selectedResource: null,
        selectedMarketIndex: null,
        overrideLocked: false, // ✅ Unlock after placement
      });
    }
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
      factoryContents: {},
      overrideOptions: null,
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
      factoryContents,
    } = get();

    if (!selectedBuilding || !selectedCells[`${row},${col}`]) return;

    const patternMatchFn = buildingPatternCheckers[selectedBuilding];
    if (!patternMatchFn) return;

    // Pass factory contents so it's excluded from pattern logic
    const resourceString = getSelectedResourceGridString(grid, selectedCells, factoryContents);
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

    // ✅ Place the lowercase name of the building
    newGrid[row][col] = selectedBuilding.toLowerCase();

    set({ grid: newGrid });
    clearSelection();
    set({ selectedBuilding: null });
  },

  cancelOverride: () => set({ overrideOptions: null, selectedResource: null, selectedMarketIndex: null }),

}));

