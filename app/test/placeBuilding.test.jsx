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

test("placeBuilding places a Well on valid pattern", async () => {
  render(<App />); // Needed to initialize Zustand

  act(() => {
    useTownStore.setState({
      grid: [
        ['wood', 'stone', null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
      selectedBuilding: 'Well',
      selectedCells: {
        '0,0': true,
        '0,1': true,
      },
      factoryContents: {},
    });
  });

  // ⛏ Manually invoke the building placement logic
  act(() => {
    useTownStore.getState().placeBuilding(0, 1); // place "Well" at row 0, col 1
  });

  await waitFor(() => {
    const state = useTownStore.getState();
    expect(state.grid[0][1]).toBe('well'); // ✅ Check that it replaced "stone"
  });
});
