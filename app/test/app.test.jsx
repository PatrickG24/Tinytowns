import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { App } from "../src/app.jsx";

describe("Tiny Towns UI", () => {
  const resourceColors = {
    wood: 'bg-amber-700',
    stone: 'bg-gray-400',
    brick: 'bg-red-500',
    wheat: 'bg-yellow-300',
    glass: 'bg-blue-300',
  };

  const isMarketButton = (btn) =>
    ["wood", "stone", "brick", "wheat", "glass"].includes(btn.textContent);

  const isGridButton = (btn) =>
    !["Restart Game", ...Object.keys(resourceColors)].includes(btn.textContent);

  beforeEach(() => {
    render(<App />);
  });

  test("renders a 4x4 grid (16 buttons)", () => {
    const gridButtons = screen.getAllByRole("button").filter(isGridButton);
    expect(gridButtons.length).toBeGreaterThanOrEqual(16);
  });

  test("renders 3 resource buttons in the market", () => {
    const marketButtons = screen.getAllByRole("button").filter(isMarketButton);
    expect(marketButtons.length).toBe(3);
  });

  test("clicking a market resource and a grid cell places the resource", () => {
    const buttons = screen.getAllByRole("button");
    const marketButtons = buttons.filter(isMarketButton);
    const gridButtons = buttons.filter(isGridButton);

    const resourceButton = marketButtons[0];
    const resourceToPlace = resourceButton.textContent;
    const expectedColor = resourceColors[resourceToPlace];

    fireEvent.click(resourceButton);
    fireEvent.click(gridButtons[0]);

    expect(gridButtons[0].className).toContain(expectedColor);
  });

  test("restart game resets the board and market", async () => {
    const resourceButtons = screen.getAllByRole("button").filter(btn =>
      ["wood", "stone", "brick", "wheat", "glass"].includes(btn.textContent)
    );
    const resourceButton = resourceButtons[0];
    fireEvent.click(resourceButton);
  
    const gridButtons = screen.getAllByRole("button").filter(btn =>
      !["Restart Game", ...["wood", "stone", "brick", "wheat", "glass"]].includes(btn.textContent)
    );
    const targetCell = gridButtons[0];
    fireEvent.click(targetCell);
  
    // Check that a resource was placed (has any resource class)
    const placedClass = targetCell.className;
    const hadResource = Object.values(resourceColors).some(color =>
      placedClass.includes(color)
    );
    expect(hadResource).toBe(true);
  
    // Click restart
    fireEvent.click(screen.getByText("Restart Game"));
  
    // Wait and assert all grid cells are reset (no resource color classes)
    await waitFor(() => {
      const newGrid = screen.getAllByRole("button").filter(btn =>
        !["Restart Game", ...["wood", "stone", "brick", "wheat", "glass"]].includes(btn.textContent)
      );
  
      newGrid.forEach(cell => {
        const classList = cell.className;
        const hasResourceClass = Object.values(resourceColors).some(color =>
          classList.includes(color)
        );
        expect(hasResourceClass).toBe(false);
      });
    });
  });
  
});



// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { App } from "../src/app.jsx";


// describe("Tiny Towns UI", () => {
//   beforeEach(() => {
//     render(<App />);
//   });

//   test("renders a 4x4 grid (16 buttons)", () => {
//     const gridButtons = screen.getAllByRole("button").filter(btn =>
//       !btn.textContent.includes("Restart")
//     );
//     expect(gridButtons.length).toBeGreaterThanOrEqual(16);
//   });

//   test("renders 3 resource buttons in the market", () => {
//     const marketButtons = screen.getAllByRole("button").filter(btn =>
//       ["wood", "stone", "brick", "wheat", "glass"].includes(btn.textContent)
//     );
//     expect(marketButtons.length).toBe(3);
//   });

//   const resourceColors = {
//     wood: 'bg-amber-700',
//     stone: 'bg-gray-400',
//     brick: 'bg-red-500',
//     wheat: 'bg-yellow-300',
//     glass: 'bg-blue-300',
//   };
  
//   test("clicking a market resource and a grid cell places the resource", () => {
//     const marketButtons = screen.getAllByRole("button").filter(btn =>
//       ["wood", "stone", "brick", "wheat", "glass"].includes(btn.textContent)
//     );
//     // const resourceToPlace = marketButtons[0].textContent;
//     const resourceButton = marketButtons[0];
//     const resourceToPlace = resourceButton.textContent;
//     const expectedColor = resourceColors[resourceToPlace];
//     fireEvent.click(resourceButton);

//     fireEvent.click(marketButtons[0]);
  
//     const gridButtons = screen.getAllByRole("button").filter(btn =>
//       !["Restart Game", ...["wood", "stone", "brick", "wheat", "glass"]].includes(btn.textContent)
//     );
//     const targetCell = gridButtons[0];
//     fireEvent.click(targetCell);
  
//     expect(targetCell.className).toContain(resourceColors[resourceToPlace]);
//   });
  


//   test("restart game resets the board and market", async () => {
//     const marketButtons = screen.getAllByRole("button").filter(btn =>
//       ["wood", "stone", "brick", "wheat", "glass"].includes(btn.textContent)
//     );
  
//     const resourceButton = marketButtons[0];
//     const resourceToPlace = resourceButton.textContent;
//     const expectedColor = resourceColors[resourceToPlace];
  
//     fireEvent.click(resourceButton);
  
//     let targetCell;
//     await waitFor(() => {
//       const gridButtons = screen.getAllByRole("button").filter(btn =>
//         !["Restart Game", ...["wood", "stone", "brick", "wheat", "glass"]].includes(btn.textContent)
//       );
//       targetCell = gridButtons[0];
//       fireEvent.click(targetCell);
//       expect(targetCell.className).toContain(expectedColor); // ✅ confirm after placement
//     });
  
//     const restartButton = screen.getByText("Restart Game");
//     fireEvent.click(restartButton);
  
//     await waitFor(() => {
//       const gridAfterReset = screen.getAllByRole("button").filter(btn =>
//         !["Restart Game", ...["wood", "stone", "brick", "wheat", "glass"]].includes(btn.textContent)
//       );
//       const classAfterReset = gridAfterReset[0].className;
//       const hasAnyResourceColor = Object.values(resourceColors).some(color =>
//         classAfterReset.includes(color)
//       );
//       expect(hasAnyResourceColor).toBe(false); // ✅ confirm reset success
//     });
//   });
  
  
  
  
//   // test("restart game resets the board and market", () => {
//   //   const marketButtons = screen.getAllByRole("button").filter(btn =>
//   //     ["wood", "stone", "brick", "wheat", "glass"].includes(btn.textContent)
//   //   );
//   //   const resourceToPlace = marketButtons[0].textContent;
//   //   fireEvent.click(marketButtons[0]);
  
//   //   const gridButtons = screen.getAllByRole("button").filter(btn =>
//   //     !["Restart Game", ...["wood", "stone", "brick", "wheat", "glass"]].includes(btn.textContent)
//   //   );
//   //   const targetCell = gridButtons[0];
//   //   fireEvent.click(targetCell);
  
//   //   // Confirm resource was placed
//   //   expect(targetCell.className).toContain(resourceColors[resourceToPlace]);
  
//   //   const restartButton = screen.getByText("Restart Game");
//   //   fireEvent.click(restartButton);
  
//   //   const gridAfterReset = screen.getAllByRole("button").filter(btn =>
//   //     !["Restart Game", ...["wood", "stone", "brick", "wheat", "glass"]].includes(btn.textContent)
//   //   );
  
//   //   // Check the cell no longer has any resource color
//   //   const classAfterReset = gridAfterReset[0].className;
//   //   const hasAnyResourceColor = Object.values(resourceColors).some(color => classAfterReset.includes(color));
//   //   expect(hasAnyResourceColor).toBe(false);
//   // });
  
  
// });
