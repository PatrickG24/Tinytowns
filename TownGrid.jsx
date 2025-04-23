import React from 'react';
import { useTownStore } from './store';

export function TownGrid() {
  const { grid, placeResource } = useTownStore((state) => ({
    grid: state.grid,
    placeResource: state.placeResource,
  }));

  return (
    <div className="grid grid-cols-4 gap-1 max-w-fit mx-auto mt-4">
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <button
            key={`${i}-${j}`}
            onClick={() => placeResource(i, j)}
            className={`w-16 h-16 border border-gray-400 text-sm font-semibold
              ${cell ? 'bg-yellow-100 text-black' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {cell || ""}
          </button>
        ))
      )}
    </div>
  );
}
