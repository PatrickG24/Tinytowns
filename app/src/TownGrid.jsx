import React from 'react';
import { useTownStore } from './store';

const resourceColors = {
  wood: 'bg-amber-700',
  stone: 'bg-gray-400',
  brick: 'bg-red-500',
  wheat: 'bg-yellow-300',
  glass: 'bg-blue-300',
};

const emojiMap = {
  farm: '🚜',
  well: '💧',
  chapel: '⛪',
  cottage: '🏠',
  tavern: '🍻',
  theater: '🎭',
  factory: '🏭',
  'cathedral of caterina': '🏰',
};

export function TownGrid() {

  const {
    grid,
    selectedResource,
    selectedBuilding,
    selectedCells,
    toggleCell,
    placeResource,
    placeBuilding,
    factoryContents, // <-- add this
  } = useTownStore((state) => ({
    grid: state.grid,
    selectedResource: state.selectedResource,
    selectedBuilding: state.selectedBuilding,
    selectedCells: state.selectedCells,
    toggleCell: state.toggleCell,
    placeResource: state.placeResource,
    placeBuilding: state.placeBuilding,
    factoryContents: state.factoryContents, // <-- and here
  }));

const handleClick = (row, col) => {
  const key = `${row},${col}`;
  const cellContent = grid[row][col];
  const isFactory = cellContent === 'factory';
  const hasFactoryContent = factoryContents?.[key];

  // ✅ Place resource in factory if allowed
  if (selectedResource && (cellContent === null || (isFactory && !hasFactoryContent))) {
    placeResource(row, col);
  }
  // ✅ Try placing building
  else if (selectedBuilding) {
    placeBuilding(row, col);
  }
  // ✅ Otherwise, toggle cell for selection
  else {
    toggleCell(row, col);
  }
};

  
  

  return (
    <div className="grid grid-cols-4 gap-1 max-w-fit mx-auto mt-4">
      {grid.map((row, i) =>
        row.map((cell, j) => {
          const key = `${i},${j}`;
          const isSelected = selectedCells[key];
          const factoryKey = `${i},${j}`;
          const isFactory = cell === 'factory';
          const hasFactoryResource = isFactory && ['wood', 'stone', 'brick', 'wheat', 'glass'].includes(factoryContents[factoryKey]);
          const resourceInFactory = factoryContents[factoryKey];
          const isResource = !isFactory && ['wood', 'stone', 'brick', 'wheat', 'glass'].includes(cell);
          const emoji = emojiMap[cell];


          const baseClass = isSelected
            ? 'border-4 border-blue-500'
            : 'border border-gray-400';

          let bgColor = 'bg-gray-200 hover:bg-gray-300';
          if (isResource) {
            bgColor = resourceColors[cell];
          } else if (hasFactoryResource) {
            bgColor = resourceColors[factoryContents[factoryKey]];
          }
          

          return (
            <button
              key={key}
              onClick={() => handleClick(i, j)}
              className={`w-16 h-16 text-xl font-bold flex items-center justify-center ${baseClass} ${bgColor}`}
            >
              {emoji || ''}
            </button>
          );
        })
      )}
    </div>
  );
}



