import React, { useEffect } from 'react';
import { TownGrid } from './TownGrid';
import { useTownStore } from './store';
import { Market } from './Market'; // you'll need the Market component too!
import { BuildingCards } from './BuildingCards';

export function App() {
  const { selectedResource, selectResource, resetGame, initDeckAndMarket } = useTownStore((state) => ({
    selectedResource: state.selectedResource,
    selectResource: state.selectResource,
    resetGame: state.resetGame,
    initDeckAndMarket: state.initDeckAndMarket,
  }));
  
  useEffect(() => {
    initDeckAndMarket(); // Initialize the deck and market when app starts
  }, [initDeckAndMarket]);

  return (
    <div className="text-center p-4">
      <h1 className="text-3xl font-bold mb-4">Tiny Towns</h1>

      <BuildingCards /> {/*Show the building cards */}
      <Market /> {/* ✅ Now show real 3 resources from the shuffled deck */}
      <TownGrid />

      <button
        onClick={resetGame}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Restart Game
      </button>
    </div>
  );
}
