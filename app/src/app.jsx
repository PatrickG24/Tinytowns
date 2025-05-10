import React, { useEffect, useState } from 'react';
import { TownGrid } from './TownGrid';
import { useTownStore } from './store';
import { Market } from './Market';
import { BuildingCards } from './BuildingCards';
import { saveGameToServer } from './saveGame';

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
    grid,
  } = useTownStore((state) => ({
    selectedResource: state.selectedResource,
    selectResource: state.selectResource,
    resetGame: state.resetGame,
    initDeckAndMarket: state.initDeckAndMarket,
    overrideResourceChoicePending: !!state.overrideOptions,
    chooseOverrideResource: state.chooseOverrideResource,
    cancelOverride: state.cancelOverride,
    calculateScore: state.calculateScore,
    grid: state.grid,
  }));

  const [score, setScore] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    initDeckAndMarket();
    setStartTime(Date.now()); // ✅ capture when the game starts
  }, [initDeckAndMarket]);

  const handleScore = () => {
    const result = calculateScore();
    setScore(result);
  };



const handleEndGame = async () => {
  const score = calculateScore();
  const endTime = Date.now();
  const user = firebaseAuth.currentUser;

  if (!user) {
    alert("You must be logged in to save your score.");
    return;
  }

  try {
    const idToken = await user.getIdToken();
    
    console.log("🟡 Saving game with data:", {
      score,
      startTime,
      endTime,
      grid,
    });
    console.log(JSON.stringify(grid, null, 2));


    const flatGrid = [];

    grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        flatGrid.push({ row: r, col: c, value: cell }); // includes nulls
      });
    });


    await saveGameToServer({ score, startTime, endTime, grid: flatGrid }, idToken);


    // await saveGameToServer({ score, startTime, endTime, grid }, idToken);
    alert(`Game saved! Your score: ${score}`);
    resetGame();
  } catch (err) {
    console.error("❌ handleEndGame error:", err);
    alert("Failed to save game.");
  }
};

  return (
    <div className="text-center p-4 relative">
      <h1 className="text-3xl font-bold mb-4">Tiny Towns</h1>

      <BuildingCards />
      <Market />
      <TownGrid />

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={resetGame}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Restart Game
        </button>

        <button
          onClick={handleEndGame}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          End Game
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={handleScore}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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




// import React, { useEffect, useState } from 'react';
// import { TownGrid } from './TownGrid';
// import { useTownStore } from './store';
// import { Market } from './Market';
// import { BuildingCards } from './BuildingCards';
// import { saveGameToServer } from './saveGame';



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
//     calculateScore,
//     grid,
//   } = useTownStore((state) => ({
//     selectedResource: state.selectedResource,
//     selectResource: state.selectResource,
//     resetGame: state.resetGame,
//     initDeckAndMarket: state.initDeckAndMarket,
//     overrideResourceChoicePending: !!state.overrideOptions,
//     chooseOverrideResource: state.chooseOverrideResource,
//     cancelOverride: state.cancelOverride,
//     calculateScore: state.calculateScore,
//     grid: state.grid,
//   }));

//   const [score, setScore] = useState(null);
//   const [startTime] = useState(Date.now());

//   useEffect(() => {
//     initDeckAndMarket();
//   }, [initDeckAndMarket]);

//   const handleScore = () => {
//     const result = calculateScore();
//     setScore(result);
//   };


// //   const handleEndGame = async () => {
// //   const score = calculateScore(); // still using your scoring logic

// //   try {
// //     await saveGameToServer(score); // only sending score
// //     alert(`Score uploaded: ${score}`);
// //     resetGame();
// //   } catch (err) {
// //     console.error(err);
// //     alert("Failed to upload score.");
// //   }
// // };
//     const handleEndGame = async () => {
//       const score = calculateScore();
//       const user = firebaseAuth.currentUser;

//       if (!user) {
//         alert("You must be logged in to save your score.");
//         return;
//       }

//       try {
//         const idToken = await user.getIdToken();

//         await saveGameToServer(score, idToken); // 🔁 pass both
//         alert(`Game saved! Your score: ${score}`);
//         resetGame();
//       } catch (err) {
//         console.error(err);
//         alert("Failed to save game.");
//       }
//     };


//   return (
//     <div className="text-center p-4 relative">
//       <h1 className="text-3xl font-bold mb-4">Tiny Towns</h1>

//       <BuildingCards />
//       <Market />
//       <TownGrid />

//       <div className="flex justify-center gap-4 mt-6">
//         <button
//           onClick={resetGame}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           Restart Game
//         </button>

//         <button
//           onClick={handleEndGame}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           End Game
//         </button>
//       </div>

//       <div className="mt-4">
//         <button
//           onClick={handleScore}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Calculate Score
//         </button>

//         {score !== null && (
//           <div className="mt-2 text-xl font-bold text-green-800">
//             Score: {score}
//           </div>
//         )}
//       </div>

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


// // import React, { useEffect, useState } from 'react';
// // import { TownGrid } from './TownGrid';
// // import { useTownStore } from './store';
// // import { Market } from './Market';
// // import { BuildingCards } from './BuildingCards';

// // const allResources = ['wood', 'stone', 'brick', 'wheat', 'glass'];

// // export function App() {
// //   const {
// //     selectedResource,
// //     selectResource,
// //     resetGame,
// //     initDeckAndMarket,
// //     overrideResourceChoicePending,
// //     chooseOverrideResource,
// //     cancelOverride,
// //     calculateScore,
// //   } = useTownStore((state) => ({
// //     selectedResource: state.selectedResource,
// //     selectResource: state.selectResource,
// //     resetGame: state.resetGame,
// //     initDeckAndMarket: state.initDeckAndMarket,
// //     overrideResourceChoicePending: !!state.overrideOptions,
// //     chooseOverrideResource: state.chooseOverrideResource,
// //     cancelOverride: state.cancelOverride,
// //     calculateScore: state.calculateScore,
// //   }));

// //   const [score, setScore] = useState(null);

// //   useEffect(() => {
// //     initDeckAndMarket();
// //   }, [initDeckAndMarket]);

// //   const handleScore = () => {
// //     const result = calculateScore();
// //     setScore(result);
// //   };

// //   return (
// //     <div className="text-center p-4 relative">
// //       <h1 className="text-3xl font-bold mb-4">Tiny Towns</h1>

// //       <BuildingCards />
// //       <Market />
// //       <TownGrid />

// //       <button
// //         onClick={resetGame}
// //         className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
// //       >
// //         Restart Game
// //       </button>

// //       <div className="mt-4">
// //         <button
// //           onClick={handleScore}
// //           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
// //         >
// //           Calculate Score
// //         </button>

// //         {score !== null && (
// //           <div className="mt-2 text-xl font-bold text-green-800">
// //             Score: {score}
// //           </div>
// //         )}
// //       </div>

// //       {overrideResourceChoicePending && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
// //           <div className="bg-white p-6 rounded shadow-lg w-80 text-black">
// //             <h2 className="text-lg font-bold mb-4">Factory Override</h2>
// //             <p className="mb-2">Choose a resource to override with:</p>
// //             <div className="flex flex-wrap justify-center gap-2 mb-4">
// //               {allResources.map((res) => (
// //                 <button
// //                   key={res}
// //                   onClick={() => chooseOverrideResource(res)}
// //                   className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
// //                 >
// //                   {res}
// //                 </button>
// //               ))}
// //             </div>
// //             <button
// //               onClick={cancelOverride}
// //               className="text-sm text-red-600 underline"
// //             >
// //               Cancel
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

