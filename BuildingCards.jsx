// BuildingCards.jsx

import React from 'react';
import { useTownStore } from './store';

// Map pattern color to Tailwind class
const patternColorClass = (color) => {
  switch (color) {
    case 'yellow': return 'bg-yellow-300';
    case 'brown':  return 'bg-yellow-700';
    case 'grey':   return 'bg-gray-400';
    case 'blue':   return 'bg-blue-300';
    case 'red':    return 'bg-red-300';
    default:       return '';
  }
};

// Seven building cards
const buildings = [
  {
    name: 'Farm',
    icon: '🚜',
    imageClass: 'farm',
    pattern: ['yellow','yellow','brown','brown'],
    effect: 'Gain 1 point for each adjacent resource that matches the pattern.',
  },
  {
    name: 'Well',
    icon: '💧',
    imageClass: 'well',
    pattern: ['brown','grey'],
    effect: 'Gain 1 point for every water resource in the same column.',
  },
  {
    name: 'Cathedral of Catarina',
    icon:'🟪',
    imageClass:'cathedral',
    pattern:['yellow','grey','blue'],
    effect:'Gain bonus points for adjacent buildings.',
  },
  {
    name: 'Theater',
    icon: '🎭',
    imageClass:'theater',
    pattern:['grey','brown','blue','brown'],
    effect:'Gain 1 point for each unique building in row & column.',
  },
  {
    name: 'Tavern',
    icon: '🍻',
    imageClass:'tavern',
    pattern:['red','red','brown'],
    effect:'Gain 1 point for every resource adjacent to this building.',
  },
  {
    name: 'Chapel',
    icon: '⛪',
    imageClass:'chapel',
    pattern:['blue','grey','blue','grey'],
    effect:'Gain 1 point for each building in the same row.',
  },
  {
    name: 'Factory',
    icon: '🏭',
    imageClass:'factory',
    pattern:['brown','red','grey','grey','red'],
    effect:'Gain 1 point for each different resource adjacent.',
  },
];

export function BuildingCards() {
  const { selectedBuilding, selectBuilding } = useTownStore((s) => ({
    selectedBuilding: s.selectedBuilding,
    selectBuilding:   s.selectBuilding,
  }));

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      {buildings.map((b) => {
        const isSelected = selectedBuilding === b.name;
        return (
          <div
            key={b.name}
            onClick={() => selectBuilding(isSelected ? null : b.name)}
            className={
              `w-48 bg-yellow-100 rounded-lg shadow-lg p-4 cursor-pointer transition-shadow ` +
              (isSelected
                ? 'border-4 border-blue-600 hover:shadow-2xl'
                : 'border-2 border-red-800 hover:shadow-2xl')
            }
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg text-black">{b.name}</span>
              <span className="text-2xl text-black">{b.icon}</span>
            </div>
            <div className={`h-24 mb-3 bg-${b.imageClass} bg-contain bg-center bg-no-repeat`} />
            <div className="grid grid-cols-3 gap-1 mb-3">
              {b.pattern.map((color,i) => (
                <div key={i} className={`w-5 h-5 ${patternColorClass(color)}`} />
              ))}
            </div>
            <div className="text-xs text-black">
              <strong>Effect:</strong> {b.effect}
            </div>
          </div>
        );
      })}
    </div>
  );
}
