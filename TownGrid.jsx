// TownGrid.jsx

import React, { useState } from 'react';
import { useTownStore } from './store';
import { buildingPatterns, isValidResourcePattern } from './logic';

const resourceColorClass = (res) => {
  switch (res) {
    case 'wheat': return 'bg-yellow-300';
    case 'glass': return 'bg-blue-300';
    case 'stone': return 'bg-gray-400';
    case 'brick': return 'bg-red-300';
    case 'wood': return 'bg-yellow-700';
    default: return '';
  }
};

export function TownGrid() {
  const {
    grid,
    selectedBuilding,
    placeBuilding,
    selectedResource,
    placeResource,
    builtBuildings,
  } = useTownStore((s) => ({
    grid: s.grid,
    selectedBuilding: s.selectedBuilding,
    placeBuilding: s.placeBuilding,
    selectedResource: s.selectedResource,
    placeResource: s.placeResource,
    builtBuildings: s.builtBuildings,
  }));

  const [selectedCells, setSelectedCells] = useState([]);

  const handleCellClick = (i, j) => {
    if (selectedBuilding) {
      const alreadySelected = selectedCells.find(cell => cell.row === i && cell.col === j);
      if (alreadySelected) {
        // Deselect
        setSelectedCells(selectedCells.filter(cell => !(cell.row === i && cell.col === j)));
      } else {
        // Select new cell
        setSelectedCells([...selectedCells, { row: i, col: j }]);
      }
    } else {
      // Just placing a resource
      placeResource(i, j);
    }
  };

  const tryPlaceBuilding = () => {
    if (!selectedBuilding || selectedCells.length === 0) return;

    const resources = selectedCells.map(cell => {
      const val = grid[cell.row][cell.col];
      return val ? val : null;
    });

    if (resources.includes(null)) {
      alert("All selected tiles must have a resource.");
      return;
    }

    const isValid = isValidResourcePattern(selectedBuilding, resources);
    if (!isValid) {
      alert("Selected resources do not match the building pattern.");
      return;
    }

    // Place building at the first selected cell
    const anchor = selectedCells[0];
    placeBuilding(anchor.row, anchor.col);
    setSelectedCells([]);
  };

  const getBuildingAt = (row, col) => {
    for (const { name, row: r0, col: c0 } of builtBuildings) {
      const pat = buildingPatterns[name].pattern;
      if (
        row >= r0 &&
        row < r0 + pat.length &&
        col >= c0 &&
        col < c0 + pat[0].length
      ) {
        return name;
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="grid grid-cols-4 gap-2 max-w-fit mx-auto">
        {grid.map((rowArr, i) =>
          rowArr.map((cell, j) => {
            const buildingName = getBuildingAt(i, j);
            const isSelected = selectedCells.some(c => c.row === i && c.col === j);

            let classNames = 'w-24 h-24 border text-sm font-semibold ';
            let content = '';

            if (buildingName) {
              classNames += 'bg-green-200 text-black';
              content = buildingName;
            } else if (cell) {
              classNames = `w-24 h-24 border text-sm font-semibold ${resourceColorClass(cell)} text-black`;
              content = cell;
            } else {
              classNames += 'border-gray-400 bg-gray-200 hover:bg-gray-300';
            }

            if (isSelected) {
              classNames += ' ring-4 ring-blue-500';
            }

            return (
              <button
                key={`${i}-${j}`}
                onClick={() => handleCellClick(i, j)}
                className={classNames}
              >
                {content}
              </button>
            );
          })
        )}
      </div>

      {selectedBuilding && (
        <button
          onClick={tryPlaceBuilding}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Place Building
        </button>
      )}
    </div>
  );
}
