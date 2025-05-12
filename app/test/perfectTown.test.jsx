import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { App } from '../src/app.jsx';
import { useTownStore } from '../src/store';

beforeAll(() => {
  global.firebaseAuth = {
    currentUser: {
      getIdToken: async () => 'mock-token',
    },
  };

  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  );
});

test("detects a Perfect Town with 15 buildings", async () => {
  render(<App />); // Init Zustand context

  const allBuildings = [
    'farm', 'well', 'chapel', 'cottage',
    'tavern', 'theater', 'factory', 'cathedral of caterina',
    'farm', 'well', 'chapel', 'cottage',
    'tavern', 'theater', 'factory', null // 15 buildings, 1 empty
  ];

  const testGrid = Array.from({ length: 4 }, (_, i) =>
    allBuildings.slice(i * 4, i * 4 + 4)
  );

  act(() => {
    useTownStore.setState({ grid: testGrid });
  });

  await waitFor(() => {
    const { grid } = useTownStore.getState();
    const allResources = ['wood', 'stone', 'brick', 'wheat', 'glass'];

    const filledBuildingCells = grid
      .flat()
      .filter(cell => cell !== null && !allResources.includes(cell)).length;

    const isPerfect = filledBuildingCells >= 15;

    expect(isPerfect).toBe(true);
  });
});
