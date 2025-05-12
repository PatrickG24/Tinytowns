import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../src/app.jsx';
import * as logic from '../src/logic'; // needed to mock initializeMarket

// 🔧 Inject global mock BEFORE importing App
beforeAll(() => {
  global.firebaseAuth = {
    currentUser: {
      getIdToken: async () => 'mock-token',
    },
  };

  // ✅ Prevent alert crash in test
  window.alert = vi.fn();

  // ✅ Mock initializeMarket to control market content
  vi.spyOn(logic, 'initializeMarket').mockImplementation((deck) => {
    return ['wheat', 'wood', 'brick'];
  });
});

describe("Tiny Towns UI Integration", () => {
  const resourceColorClass = {
    wood: 'bg-amber-700',
    stone: 'bg-gray-400',
    brick: 'bg-red-500',
    wheat: 'bg-yellow-300',
    glass: 'bg-blue-300',
  };

  const isResource = (text) => Object.keys(resourceColorClass).includes(text);

  const getMarketButtons = () =>
    screen.getAllByRole('button').filter((b) => isResource(b.textContent));

  const getGridButtons = () =>
    screen.getAllByRole('button').filter(
      (btn) =>
        !["Restart Game", "End Game", "Calculate Score", "View Profile", "Back to Game"].includes(btn.textContent) &&
        !isResource(btn.textContent)
    );

  beforeEach(() => {
    render(<App />);
  });

  test("renders a 4x4 grid (16 cells)", () => {
    const gridButtons = getGridButtons();
    expect(gridButtons.length).toBe(16);
  });

  test("market shows 3 resource buttons", () => {
    const marketButtons = getMarketButtons();
    expect(marketButtons.length).toBe(3);
  });

  test("clicking a resource and grid cell places the resource", async () => {
    const marketButtons = getMarketButtons();
    const gridButtons = getGridButtons();
    const selectedResource = marketButtons[0].textContent;

    fireEvent.click(marketButtons[0]);
    fireEvent.click(gridButtons[0]);

    await waitFor(() => {
      expect(gridButtons[0].className).toMatch(new RegExp(resourceColorClass[selectedResource]));
    });
  });

  test("cannot overwrite a filled cell", async () => {
    const marketButtons = getMarketButtons();
    const gridButtons = getGridButtons();

    fireEvent.click(marketButtons[0]);
    fireEvent.click(gridButtons[0]);

    const beforeColor = gridButtons[0].className.match(/bg-\S+/)[0];

    fireEvent.click(marketButtons[1]);
    fireEvent.click(gridButtons[0]);

    await waitFor(() => {
      expect(gridButtons[0].className).toContain(beforeColor);
    });
  });

  test("reset clears all placed resources", async () => {
    const marketButtons = getMarketButtons();
    const gridButtons = getGridButtons();

    fireEvent.click(marketButtons[0]);
    fireEvent.click(gridButtons[0]);

    fireEvent.click(screen.getByText("Restart Game"));

    await waitFor(() => {
      const newGrid = getGridButtons();
      newGrid.forEach((cell) => {
        expect(cell.className).not.toMatch(/bg-(amber-700|gray-400|red-500|yellow-300|blue-300)/);
      });
    });
  });

  test("end game displays score", async () => {
    const marketButtons = getMarketButtons();
    const gridButtons = getGridButtons();

    fireEvent.click(marketButtons[0]);
    fireEvent.click(gridButtons[0]);

    fireEvent.click(screen.getByText("End Game"));

    await waitFor(() => {
      expect(screen.getByText(/Score:/)).toBeTruthy();
    });
  });


});
