import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { App } from "../src/app.jsx";

describe("Tiny Towns UI", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("renders a 4x4 grid (16 buttons)", () => {
    const gridButtons = screen.getAllByRole("button").filter(btn =>
      !btn.textContent.includes("Restart")
    );
    expect(gridButtons.length).toBeGreaterThanOrEqual(16);
  });

  test("renders 3 resource buttons in the market", () => {
    const marketButtons = screen.getAllByRole("button").filter(btn =>
      ["wood", "stone", "brick", "wheat", "glass"].includes(btn.textContent)
    );
    expect(marketButtons.length).toBe(3);
  });

  const resourceColors = {
    wood: 'bg-amber-700',
    stone: 'bg-gray-400',
    brick: 'bg-red-500',
    wheat: 'bg-yellow-300',
    glass: 'bg-blue-300',
  };
  
  test("clicking a market resource and a grid cell places the resource", () => {
    const marketButtons = screen.getAllByRole("button").filter(btn =>
      ["wood", "stone", "brick", "wheat", "glass"].includes(btn.textContent)
    );
    const resourceToPlace = marketButtons[0].textContent;
    fireEvent.click(marketButtons[0]);
  
    const gridButtons = screen.getAllByRole("button").filter(btn =>
      !["Restart Game", ...["wood", "stone", "brick", "wheat", "glass"]].includes(btn.textContent)
    );
    const targetCell = gridButtons[0];
    fireEvent.click(targetCell);
  
    expect(targetCell.className).toContain(resourceColors[resourceToPlace]);
  });
  

  test("restart game resets the board and market", () => {
    const marketButtons = screen.getAllByRole("button").filter(btn =>
      ["wood", "stone", "brick", "wheat", "glass"].includes(btn.textContent)
    );
    const resourceToPlace = marketButtons[0].textContent;
    fireEvent.click(marketButtons[0]);
  
    const gridButtons = screen.getAllByRole("button").filter(btn =>
      !["Restart Game", ...["wood", "stone", "brick", "wheat", "glass"]].includes(btn.textContent)
    );
    const targetCell = gridButtons[0];
    fireEvent.click(targetCell);
  
    // Confirm resource was placed
    expect(targetCell.className).toContain(resourceColors[resourceToPlace]);
  
    const restartButton = screen.getByText("Restart Game");
    fireEvent.click(restartButton);
  
    const gridAfterReset = screen.getAllByRole("button").filter(btn =>
      !["Restart Game", ...["wood", "stone", "brick", "wheat", "glass"]].includes(btn.textContent)
    );
  
    // Check the cell no longer has any resource color
    const classAfterReset = gridAfterReset[0].className;
    const hasAnyResourceColor = Object.values(resourceColors).some(color => classAfterReset.includes(color));
    expect(hasAnyResourceColor).toBe(false);
  });
  
  
});
