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
  'cathedral of catarina': '🏰',
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
  } = useTownStore((state) => ({
    grid: state.grid,
    selectedResource: state.selectedResource,
    selectedBuilding: state.selectedBuilding,
    selectedCells: state.selectedCells,
    toggleCell: state.toggleCell,
    placeResource: state.placeResource,
    placeBuilding: state.placeBuilding,
  }));

  const handleClick = (row, col) => {
    const key = `${row},${col}`;
    const isFilled = grid[row][col];

    if (!isFilled && selectedResource) {
      placeResource(row, col);
    } else if (selectedBuilding) {
      placeBuilding(row, col);
    } else {
      toggleCell(row, col);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-1 max-w-fit mx-auto mt-4">
      {grid.map((row, i) =>
        row.map((cell, j) => {
          const key = `${i},${j}`;
          const isSelected = selectedCells[key];
          const isResource = cell && resourceColors[cell];
          const emoji = emojiMap[cell];

          const baseClass = isSelected
            ? 'border-4 border-blue-500'
            : 'border border-gray-400';

          const bgColor = isResource ? resourceColors[cell] : 'bg-gray-200 hover:bg-gray-300';

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


// import React from 'react';
// import { useTownStore } from './store';

// const resourceColors = {
//   wood: 'bg-amber-700',
//   stone: 'bg-gray-400',
//   brick: 'bg-red-500',
//   wheat: 'bg-yellow-300',
//   glass: 'bg-blue-300',
// };

// const buildingColors = {
//   farm: 'bg-green-300',
//   well: 'bg-cyan-300',
//   chapel: 'bg-indigo-300',
//   cottage: 'bg-orange-200',
//   tavern: 'bg-yellow-500',
//   theater: 'bg-pink-300',
//   factory: 'bg-gray-700',
//   'cathedral of catarina': 'bg-purple-700',
// };

// const emojiMap = {
//   farm: '🚜',
//   well: '💧',
//   chapel: '⛪',
//   cottage: '🏠',
//   tavern: '🍻',
//   theater: '🎭',
//   factory: '🏭',
//   'cathedral of catarina': '🏰',
// };

// export function TownGrid() {
//   const {
//     grid,
//     selectedResource,
//     selectedBuilding,
//     selectedCells,
//     toggleCell,
//     placeResource,
//     placeBuilding,
//   } = useTownStore((state) => ({
//     grid: state.grid,
//     selectedResource: state.selectedResource,
//     selectedBuilding: state.selectedBuilding,
//     selectedCells: state.selectedCells,
//     toggleCell: state.toggleCell,
//     placeResource: state.placeResource,
//     placeBuilding: state.placeBuilding,
//   }));

//   const handleClick = (row, col) => {
//     const key = `${row},${col}`;
//     const isFilled = grid[row][col];

//     if (!isFilled && selectedResource) {
//       placeResource(row, col);
//     } else if (selectedBuilding) {
//       placeBuilding(row, col);
//     } else {
//       toggleCell(row, col);
//     }
//   };

//   return (
//     <div className="grid grid-cols-4 gap-1 max-w-fit mx-auto mt-4">
//       {grid.map((row, i) =>
//         row.map((cell, j) => {
//           const key = `${i},${j}`;
//           const isSelected = selectedCells[key];

//           const resourceClass = cell && resourceColors[cell];
//           const buildingClass = cell && buildingColors[cell];

//           const baseClass = isSelected
//             ? 'border-4 border-blue-500'
//             : 'border border-gray-400';

//           const bgColor = resourceClass || buildingClass || 'bg-gray-200 hover:bg-gray-300';

//           return (
//             <button
//               key={key}
//               onClick={() => handleClick(i, j)}
//               className={`w-16 h-16 text-xl font-bold flex items-center justify-center ${baseClass} ${bgColor}`}
//             >
//               {emojiMap[cell] || ''}
//             </button>
//           );
//         })
//       )}
//     </div>
//   );
// }


// // import React from 'react';
// // import { useTownStore } from './store';

// // // Optional: define colors for each resource
// // const resourceColors = {
// //   wood: 'bg-amber-700',
// //   stone: 'bg-gray-400',
// //   brick: 'bg-red-500',
// //   wheat: 'bg-yellow-300',
// //   glass: 'bg-blue-200',
// // };

// // // Optional: define colors for each building
// // const buildingColors = {
// //   cottage: 'bg-purple-300',
// //   farm: 'bg-green-300',
// //   chapel: 'bg-indigo-300',
// //   theater: 'bg-pink-300',
// //   tavern: 'bg-orange-200',
// //   factory: 'bg-gray-600',
// //   well: 'bg-cyan-200',
// //   cathedral: 'bg-fuchsia-400',
// // };

// // // Display emoji or fallback text
// // const displayValue = (cell) => {
// //   const emojiMap = {
// //     wood: '🪵',
// //     stone: '🪨',
// //     brick: '🧱',
// //     wheat: '🌾',
// //     glass: '🧪',
// //     cottage: '🏠',
// //     farm: '🌽',
// //     chapel: '⛪',
// //     theater: '🎭',
// //     tavern: '🍻',
// //     factory: '🏭',
// //     well: '💧',
// //     cathedral: '🏰',
// //   };
// //   return emojiMap[cell] || cell;
// // };

// // export function TownGrid() {
// //   const { grid, placeResource } = useTownStore((state) => ({
// //     grid: state.grid,
// //     placeResource: state.placeResource,
// //   }));

// //   return (
// //     <div className="grid grid-cols-4 gap-1 max-w-fit mx-auto mt-4">
// //       {grid.map((row, i) =>
// //         row.map((cell, j) => {
// //           const isResource = resourceColors[cell];
// //           const isBuilding = buildingColors[cell];

// //           const backgroundClass = isResource
// //             ? resourceColors[cell]
// //             : isBuilding
// //             ? buildingColors[cell]
// //             : 'bg-gray-200 hover:bg-gray-300';

// //           return (
// //             <button
// //               key={`${i}-${j}`}
// //               onClick={() => placeResource(i, j)}
// //               className={`w-16 h-16 border border-gray-400 text-xl font-semibold flex items-center justify-center ${backgroundClass}`}
// //             >
// //               {displayValue(cell)}
// //             </button>
// //           );
// //         })
// //       )}
// //     </div>
// //   );
// // }



