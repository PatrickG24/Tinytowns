import create from 'zustand';

export const useTownStore = create((set) => ({
  grid: Array.from({ length: 4 }, () => Array(4).fill(null)),
  selectedResource: null,

  // Set the selected resource (e.g., "wheat", "wood", etc.)
  selectResource: (resource) => set({ selectedResource: resource }),

  // Place the selected resource at a specific grid cell
  placeResource: (row, col) =>
    set((state) => {
      if (!state.selectedResource || state.grid[row][col]) return state;
      const newGrid = state.grid.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? state.selectedResource : cell))
      );
      return { grid: newGrid, selectedResource: null };
    }),

  // Reset the entire grid
  resetGrid: () =>
    set({
      grid: Array.from({ length: 4 }, () => Array(4).fill(null)),
      selectedResource: null,
    }),
}));
