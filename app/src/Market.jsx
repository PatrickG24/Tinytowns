import React from 'react';
import { useTownStore } from './store';

export function Market() {
  const { market, selectResource, selectedResource, selectedMarketIndex } = useTownStore((state) => ({
    market: state.market,
    selectResource: state.selectResource,
    selectedResource: state.selectedResource,
    selectedMarketIndex: state.selectedMarketIndex,
  }));

  return (
    <div className="flex justify-center gap-4 mt-4">
      {market.map((resource, idx) => (
        <button
          key={idx}
          onClick={() => selectResource(resource, idx)}
          className={`p-4 border rounded text-lg font-semibold ${
            selectedMarketIndex === idx ? 'bg-blue-500 text-white' : 'bg-white text-black'
          }`}
        >
          {resource}
        </button>
      ))}
    </div>
  );
}

