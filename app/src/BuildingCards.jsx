// BuildingCards.jsx

import React from 'react';
import { useTownStore } from './store';

const patternColorClass = (resource) => {
  switch (resource) {
    case 'wheat': return 'bg-yellow-300';
    case 'wood':  return 'bg-amber-700';
    case 'stone': return 'bg-gray-400';
    case 'glass': return 'bg-blue-300';
    case 'brick': return 'bg-red-500';
    default:      return '';
  }
};


// Seven building cards
const buildings = [
  {
    name: 'Farm',
    icon: '🚜',
    imageClass: 'farm',
    pattern: [
      ['wheat', 'wheat'],
      ['wood',  'wood']
    ],
    effect: 'Gain 1 point for each adjacent resource that matches the pattern.',
  },
  
  {
    name: 'Well',
    icon: '💧',
    imageClass: 'well',
    pattern: ['wood','stone'],
    effect: 'Gain 1 point for every water resource in the same column.',
  },

  {
    name: 'Cottage',
    icon: '🏠',
    imageClass: 'farm',
    pattern: [
      [null, 'wheat'],
      ['brick',  'glass']
    ],
    effect: 'Gain 3 points if fed.',
  },

  {
    name: 'Cathedral of Catarina',
    icon:'🏰',
    imageClass:'cathedral',
    pattern:[
      [null, 'wheat'],
      ['stone', 'glass']
    ],
    effect:'Gain bonus points for adjacent buildings.',
  },
  {
    name: 'Theater',
    icon: '🎭',
    imageClass:'theater',
    pattern:[
      [null, 'stone', null],
      ['wood', 'glass', 'wood']
    ],
    effect:'Gain 1 point for each unique building in row & column.',
  },
  {
    name: 'Tavern',
    icon: '🍻',
    imageClass:'tavern',
    pattern:['brick','brick','glass'],
    effect:'Gain 1 point for every resource adjacent to this building.',
  },
  {
    name: 'Chapel',
    icon: '⛪',
    imageClass:'chapel',
    pattern:[
      [null, null, 'glass'],
      ['stone', 'glass', 'stone']
    ],
    effect:'Gain 1 point for each building in the same row.',
  },
  {
    name: 'Factory',
    icon: '🏭',
    imageClass:'factory',
    pattern:[
      ['wood', null, null, null],
      ['brick', 'stone', 'stone', 'brick']
    ],
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
            <div
              className="inline-grid gap-0.5 mb-3"
              style={{
                gridTemplateColumns: `repeat(${Array.isArray(b.pattern[0]) ? b.pattern[0].length : b.pattern.length}, 1fr)`
              }}
            >
              {(Array.isArray(b.pattern[0]) ? b.pattern.flat() : b.pattern).map((resource, i) => (
                <div key={i} className={`w-5 h-5 ${patternColorClass(resource)}`} />
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
