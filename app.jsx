import React from 'react';
import { TownGrid } from './TownGrid';
import { useTownStore } from './store';

const resources = ['wheat', 'glass', 'stone', 'brick', 'wood'];

export function App() {
  const { selectedResource, selectResource, resetGrid } = useTownStore((state) => ({
    selectedResource: state.selectedResource,
    selectResource: state.selectResource,
    resetGrid: state.resetGrid,
  }));

  return (
    <div className="text-center p-4">
      <h1 className="text-3xl font-bold mb-4">Tiny Towns</h1>

      <div className="flex justify-center gap-2 mb-4">
        {resources.map((res) => (
          <button
            key={res}
            onClick={() => selectResource(res)}
            className={`px-3 py-2 rounded border font-semibold ${
              selectedResource === res
                ? 'bg-blue-500 text-white'
                : 'bg-white text-black border-gray-400'
            }`}
          >
            {res}
          </button>
        ))}
      </div>

      <TownGrid />

      <button
        onClick={resetGrid}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Reset Grid
      </button>
    </div>
  );
}
