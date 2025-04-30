// store.js

import create from 'zustand';
import { canPlaceBuilding } from './logic';

const allResources = ["wheat", "glass", "stone", "brick", "wood"];

export const useTownStore = create((set) => ({
  // State
  grid: Array.from({ length: 4 }, () => Array(4).fill(null)),
  selectedResource: null,
  selectedBuilding: null,
  marketResources: shuffleResources(),
  builtBuildings: [],

  // Actions
  selectResource: (resource) => set({ selectedResource: resource }),
  selectBuilding: (building)  => set({ selectedBuilding: building }),

  placeResource: (row, col) =>
    set((state) => {
      if (!state.selectedResource || state.grid[row][col]) return state;
      const newGrid = state.grid.map((r, i) =>
        r.map((cell, j) =>
          i === row && j === col ? state.selectedResource : cell
        )
      );
      return {
        grid: newGrid,
        selectedResource: null,
        marketResources: shuffleResources(),
        selectedBuilding: null,
      };
    }),

  placeBuilding: (row, col) =>
    set((state) => {
      const name = state.selectedBuilding;
      if (!name) return state;
      if (!canPlaceBuilding(state.grid, name, row, col)) {
        alert(`Cannot place ${name} here!`);
        return state;
      }
      const placement = { name, row, col };
      return {
        builtBuildings: [...state.builtBuildings, placement],
        selectedBuilding: null,
      };
    }),

  resetGrid: () =>
    set({
      grid: Array.from({ length: 4 }, () => Array(4).fill(null)),
      selectedResource: null,
      selectedBuilding: null,
      marketResources: shuffleResources(),
      builtBuildings: [],
    }),
}));

function shuffleResources() {
  return [...allResources].sort(() => 0.5 - Math.random()).slice(0, 3);
}
