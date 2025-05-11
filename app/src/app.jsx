import React, { useEffect, useState } from 'react';
import { TownGrid } from './TownGrid';
import { useTownStore } from './store';
import { Market } from './Market';
import { BuildingCards } from './BuildingCards';
import { saveGameToServer } from './saveGame';
import { updateAchievementsOnServer } from './achievements';
import { Profile } from './Profile';

const allResources = ['wood', 'stone', 'brick', 'wheat', 'glass'];

function evaluateAchievements(score, grid) {
  const filledBuildingCells = grid
    .flat()
    .filter(cell => cell !== null && !allResources.includes(cell)).length;

  return {
    perfectTown: filledBuildingCells >= 15,
    highScore: score >= 50,
    zeroScore: score === 0,
    masterArchitect: score >= 38,
    townPlanner: score >= 32 && score <= 37,
    engineer: score >= 25 && score <= 31,
    carpenter: score >= 18 && score <= 24,
    buildersApprentice: score >= 10 && score <= 17,
    aspiringArchitect: score >= -9 && score <= 9,
    WhatANoob: score >= -16 && score <= -10,
  };
}

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
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    initDeckAndMarket();
    setStartTime(Date.now());
    setUser(firebaseAuth.currentUser);
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
      const flatGrid = [];
      grid.forEach((row, r) => {
        row.forEach((cell, c) => {
          flatGrid.push({ row: r, col: c, value: cell });
        });
      });

      const achievements = evaluateAchievements(score, grid);

      await saveGameToServer({ score, startTime, endTime, grid: flatGrid }, idToken);
      await updateAchievementsOnServer(achievements, idToken);

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

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          {showProfile ? "Back to Game" : "View Profile"}
        </button>
      </div>

      {showProfile ? (
        <Profile user={user} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}