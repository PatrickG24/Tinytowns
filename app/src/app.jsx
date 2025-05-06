import React, { useEffect, useState } from 'react';
import { TownGrid } from './TownGrid';
import { useTownStore } from './store';
import { Market } from './Market';
import { BuildingCards } from './BuildingCards';

const allResources = ['wood', 'stone', 'brick', 'wheat', 'glass'];

export function App() {
  const {
    selectedResource,
    selectResource,
    resetGame,
    initDeckAndMarket,
    overrideResourceChoicePending,
    chooseOverrideResource,
    cancelOverride,
    calculateScore,
  } = useTownStore((state) => ({
    selectedResource: state.selectedResource,
    selectResource: state.selectResource,
    resetGame: state.resetGame,
    initDeckAndMarket: state.initDeckAndMarket,
    overrideResourceChoicePending: !!state.overrideOptions,
    chooseOverrideResource: state.chooseOverrideResource,
    cancelOverride: state.cancelOverride,
    calculateScore: state.calculateScore,
  }));

  const [score, setScore] = useState(null);

  useEffect(() => {
    initDeckAndMarket();
  }, [initDeckAndMarket]);

  const handleScore = () => {
    const result = calculateScore();
    setScore(result);
  };

  return (
    <div className="text-center p-4 relative">
      <h1 className="text-3xl font-bold mb-4">Tiny Towns</h1>

      <BuildingCards />
      <Market />
      <TownGrid />

      <button
        onClick={resetGame}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Restart Game
      </button>

      <div className="mt-4">
        <button
          onClick={handleScore}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Calculate Score
        </button>

        {score !== null && (
          <div className="mt-2 text-xl font-bold text-green-800">
            Score: {score}
          </div>
        )}
      </div>

      {overrideResourceChoicePending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-black">
            <h2 className="text-lg font-bold mb-4">Factory Override</h2>
            <p className="mb-2">Choose a resource to override with:</p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {allResources.map((res) => (
                <button
                  key={res}
                  onClick={() => chooseOverrideResource(res)}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
                >
                  {res}
                </button>
              ))}
            </div>
            <button
              onClick={cancelOverride}
              className="text-sm text-red-600 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



// import React, { useEffect } from 'react';
// import { TownGrid } from './TownGrid';
// import { useTownStore } from './store';
// import { Market } from './Market';
// import { BuildingCards } from './BuildingCards';

// const allResources = ['wood', 'stone', 'brick', 'wheat', 'glass'];

// export function App() {
//   const {
//     selectedResource,
//     selectResource,
//     resetGame,
//     initDeckAndMarket,
//     overrideResourceChoicePending,
//     chooseOverrideResource,
//     cancelOverride,
//   } = useTownStore((state) => ({
//     selectedResource: state.selectedResource,
//     selectResource: state.selectResource,
//     resetGame: state.resetGame,
//     initDeckAndMarket: state.initDeckAndMarket,
//     overrideResourceChoicePending: !!state.overrideOptions,
//     chooseOverrideResource: state.chooseOverrideResource,
//     cancelOverride: state.cancelOverride,
//   }));

//   useEffect(() => {
//     initDeckAndMarket();
//   }, [initDeckAndMarket]);

//   return (
//     <div className="text-center p-4 relative">
//       <h1 className="text-3xl font-bold mb-4">Tiny Towns</h1>

//       <BuildingCards />
//       <Market />
//       <TownGrid />

//       <button
//         onClick={resetGame}
//         className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//       >
//         Restart Game
//       </button>

//       {/* ✅ Factory override selection UI */}
//       {overrideResourceChoicePending && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-lg w-80 text-black">
//             <h2 className="text-lg font-bold mb-4">Factory Override</h2>
//             <p className="mb-2">Choose a resource to override with:</p>
//             <div className="flex flex-wrap justify-center gap-2 mb-4">
//               {allResources.map((res) => (
//                 <button
//                   key={res}
//                   onClick={() => chooseOverrideResource(res)}
//                   className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
//                 >
//                   {res}
//                 </button>
//               ))}
//             </div>
//             <button
//               onClick={cancelOverride}
//               className="text-sm text-red-600 underline"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

