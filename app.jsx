// App.jsx

import React from 'react';
import { BuildingCards } from './BuildingCards';
import { TownGrid }      from './TownGrid';
import { useTownStore }  from './store';

// Map resource to Tailwind bg
const resourceColorClass = (res) => {
  switch (res) {
    case 'wheat': return 'bg-yellow-300';
    case 'glass': return 'bg-blue-300';
    case 'stone': return 'bg-gray-400';
    case 'brick': return 'bg-red-300';
    case 'wood':  return 'bg-yellow-700';
    default:      return 'bg-white';
  }
};

export function App() {
  const {
    selectedResource,
    selectResource,
    resetGrid,
    marketResources,
  } = useTownStore((s) => ({
    selectedResource: s.selectedResource,
    selectResource:   s.selectResource,
    resetGrid:        s.resetGrid,
    marketResources:  s.marketResources,
  }));

  return (
    <div className="text-center p-4">
      <h1 className="text-3xl font-bold mb-4">Tiny Towns</h1>

      {/* Building Cards */}
      <BuildingCards />

      {/* Market Panel */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Market Resources</h2>
        <div className="flex justify-center gap-4 mb-2">
          {marketResources.map((res) => {
            const isSel = selectedResource === res;
            return (
              <button
                key={res}
                onClick={() => selectResource(isSel ? null : res)}
                className={`px-4 py-2 rounded border-2 font-semibold ${resourceColorClass(res)} ${
                  isSel
                    ? 'border-black text-white'
                    : 'border-transparent hover:border-black text-black'
                }`}
              >
                {res}
              </button>
            );
          })}
        </div>
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
