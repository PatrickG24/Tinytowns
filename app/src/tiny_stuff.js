let selectedResource = null;

// Dictionary to hold selected cell positions as keys in the form "row,col"
const selectedGridPositions = {};

// Initialize a 4x4 grid filled with null (or you can use '_' or empty strings)
const gridState = Array.from({ length: 4 }, () => Array(4).fill(null));
console.log(gridState);

/**
 * createShuffledDeck()
 * ---------------------
 * 1. We build an array of resources (wood, stone, brick, wheat, glass),
 *    each repeated 3 times.
 * 2. We shuffle that array randomly.
 * 3. The deck is returned so we can draw from it.
 */
function createShuffledDeck() {
    let resources = ["wood", "stone", "brick", "wheat", "glass"];
    let deck = [];

    // Add each resource 3 times
    resources.forEach(resource => {
        for (let i = 0; i < 3; i++) {
            deck.push(resource);
        }
    });

    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

// Our global deck of resources
let deck = createShuffledDeck();

// Tracks which grid cells are selected (for building placement)
let selectedCells = new Set();
let selectedBuilding = null;

document.addEventListener("DOMContentLoaded", function () {
    // We create the initial 3 resources in the market
    createMarket(deck);
    attachGridListeners();
    attachBuildingListeners();
});

/**
 * createMarket(deck)
 * ------------------
 * Draws 3 resources from the top of the deck (deck.shift())
 * and displays them as cards in the market. Each time you place
 * a resource on the board, we also call `marketRefresh()` to
 * remove that resource from the market and draw a new one.
 */
function createMarket(deck) {
    const marketContainer = document.querySelector(".market");
    marketContainer.innerHTML = "";

    // Pull 3 resources off the top of the deck
    for (let i = 0; i < 3; i++) {
        let resource = deck.shift();

        let card = document.createElement("div");
        card.classList.add("resource-card", resource);
        card.setAttribute("data-resource", resource);

        let label = document.createElement("div");
        label.classList.add("resource-label");
        label.textContent = resource.charAt(0).toUpperCase() + resource.slice(1);

        let icon = document.createElement("div");
        icon.classList.add("resource-icon", resource);

        card.appendChild(label);
        card.appendChild(icon);
        marketContainer.appendChild(card);
    }

    attachMarketListeners();
}

/**
 * marketRefresh(placedResource)
 * -----------------------------
 * When you place a resource on the grid, that resource is removed
 * from the market, put back at the bottom of the deck, and then we
 * draw a new resource (deck.shift()) to keep the market at 3 cards.
 */
function marketRefresh(placedResource) {
    const marketContainer = document.querySelector(".market");
    let cardToRemove = marketContainer.querySelector(`.resource-card[data-resource="${placedResource}"]`);

    if (cardToRemove) {
        marketContainer.removeChild(cardToRemove);
    } else {
        console.warn("Could not find resource to remove:", placedResource);
        return;
    }

    // Put the used resource at the bottom of the deck
    deck.push(placedResource);

    // If the deck has anything left, draw a new card
    if (deck.length > 0) {
        let newResource = deck.shift();

        let newCard = document.createElement("div");
        newCard.classList.add("resource-card", newResource);
        newCard.setAttribute("data-resource", newResource);

        let label = document.createElement("div");
        label.classList.add("resource-label");
        label.textContent = newResource.charAt(0).toUpperCase() + newResource.slice(1);

        let icon = document.createElement("div");
        icon.classList.add("resource-icon", newResource);

        newCard.appendChild(label);
        newCard.appendChild(icon);
        marketContainer.appendChild(newCard);
    }

    attachMarketListeners();
}

function attachMarketListeners() {
    const resourceCards = document.querySelectorAll(".resource-card");

    resourceCards.forEach(card => {
        card.removeEventListener("click", handleResourceClick); // Prevent duplicate listeners
        card.addEventListener("click", handleResourceClick);
    });
}

function handleResourceClick() {
    // If any grid cells are selected, don't allow resource selection
    if (document.querySelectorAll(".grid-cell.selected").length > 0) {
        console.log("Cannot select resource, grid tiles are selected!");
        return;
    }

    if (this.classList.contains("selected")) {
        this.classList.remove("selected");
        selectedResource = null;
        console.log("Deselected resource.");
    } else {
        document.querySelectorAll(".resource-card").forEach(c => c.classList.remove("selected"));
        this.classList.add("selected");
        selectedResource = this.getAttribute("data-resource");
        console.log("Selected resource:", selectedResource);
    }
}


function attachBuildingListeners() {
    const buildingCards = document.querySelectorAll(".cards-container .card");

    buildingCards.forEach(card => {
        card.removeEventListener("click", handleBuildingClick); // Prevent duplicate listeners
        card.addEventListener("click", handleBuildingClick);
    });
}

function handleBuildingClick() {
    if (!this.classList.contains("readyToBuild")) {
        console.log("This building is not ready to be built!");
        return; 
    }

    const buildingName = this.querySelector(".card-title").textContent.trim();
    
    if (!areCorrectGridsSelected(buildingName)) {
        console.log(`Incorrect grid selection for ${buildingName}.`);
        return; 
    }

    console.log("Building clicked:", buildingName);

    if (this.classList.contains("selected")) {
        this.classList.remove("selected");
        selectedBuilding = null;
        console.log("Deselected building.");
    } else {
        document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
        this.classList.add("selected");
        selectedBuilding = buildingName;
        console.log("Selected building:", selectedBuilding);
    }
}

function placeBuilding(targetCell, buildingType) {
    if (!selectedCells.has(targetCell)) {
        console.log("You must place the building in a selected tile.");
        return;
    }

    // Clear resources from selected tiles
    selectedCells.forEach(cell => {
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }
    });

    // Create the building icon element
    const buildingIcon = document.createElement("div");
    buildingIcon.classList.add("building-icon", buildingType.toLowerCase().replace(/\s/g, "-")); 

    // Assign correct icon based on building type
    const buildingIcons = {
        "Farm": "🚜",
        "Well": "💧",
        "Theater": "🎭",
        "Tavern": "🍻",
        "Chapel": "⛪",
        "Factory": "🏭",
        "Cottage": "🏠",
        "Cathedral of Catarina": "🟪"
    };

    buildingIcon.innerHTML = buildingIcons[buildingType] || "❓";
    targetCell.appendChild(buildingIcon);

    console.log(`${buildingType} placed successfully in the selected tile!`);

    // Clear selection highlights and reset
    selectedCells.forEach(cell => cell.classList.remove("selected"));
    selectedCells.clear();
    clearSelectionAfterPlacement();
    updateBuildingReadiness();
}

/* -----------------------------------------------------------------------
   Resource validation for each building 
   ----------------------------------------------------------------------- */


   function areCorrectGridsSelected(buildingName) {
    const resourceString = getSelectedResourceGridString(selectedGridPositions);

    if (buildingName === "Farm") {
        return checkFarm(resourceString);
    }

    if (buildingName === "Well") {
        return checkWell(resourceString);
    }

    if (buildingName === "Cottage") {
        return checkCottage(resourceString);
    }

    if (buildingName === "Chapel") {
        return checkChapel(resourceString);
    }

    if (buildingName === "Tavern") {
        return checkTavern(resourceString);
    }

    if (buildingName === "Theater") {
        return checkTheater(resourceString);
    }

    if (buildingName === "Factory") {
        return checkFactory(resourceString);
    }

    if (buildingName === "Cathedral of Catarina") {
        return checkCathedralOfCaterina(resourceString);
    }

    return false; // If the building name doesn’t match any case
}



function updateBuildingReadiness() {
    document.querySelectorAll(".cards-container .card").forEach(card => {
        const buildingName = card.querySelector(".card-title").textContent.trim();
        if (areCorrectGridsSelected(buildingName)) {
            if (!card.classList.contains("readyToBuild")) {
                card.classList.add("readyToBuild");
                console.log(`${buildingName} is now ready to build.`);
            }
        } else {
            if (card.classList.contains("readyToBuild")) {
                card.classList.remove("readyToBuild");
                console.log(`${buildingName} is no longer ready to build.`);
            }
        }
    });
}


function getMinMaxCoords(selectedDict) {
    const rows = [];
    const cols = [];
  
    Object.keys(selectedDict).forEach(key => {
      const [row, col] = key.split(',').map(Number);
      rows.push(row);
      cols.push(col);
    });
  
    if (rows.length === 0 || cols.length === 0) {
      return null; // or [null, null, null, null] if you prefer
    }
  
    const minRow = Math.min(...rows);
    const maxRow = Math.max(...rows);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);
  
    return [minRow, maxRow, minCol, maxCol];
  }


function attachGridListeners() {
    document.querySelectorAll(".grid-cell").forEach(cell => {
        cell.addEventListener("click", function () {

            if (selectedBuilding === "Farm") {
                if (selectedCells.has(this)) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else {
                    console.log("Click on a selected tile to place the Farm.");
                    return;
                }
            }
            
            if (selectedBuilding === "Well") {
                if (selectedCells.has(this)) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else if (selectedCells.size === 1) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else {
                    console.log("Click on a selected tile to place the Well.");
                    return;
                }
            }

            if (selectedBuilding === "Factory") {
                if (selectedCells.has(this)) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else if (selectedCells.size === 1) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else {
                    console.log("Click on a selected tile to place the Factory.");
                    return;
                }
            }

            if (selectedBuilding === "Cathedral of Catarina") {
                if (selectedCells.has(this)) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else if (selectedCells.size === 1) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else {
                    console.log("Click on a selected tile to place the Cathedral of Catarina.");
                    return;
                }
            }

            if (selectedBuilding === "Tavern") {
                if (selectedCells.has(this)) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else if (selectedCells.size === 1) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else {
                    console.log("Click on a selected tile to place the Tavern.");
                    return;
                }
            }

            if (selectedBuilding === "Chapel") {
                if (selectedCells.has(this)) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else if (selectedCells.size === 1) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else {
                    console.log("Click on a selected tile to place the Chapel.");
                    return;
                }
            }

            if (selectedBuilding === "Theater") {
                if (selectedCells.has(this)) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else if (selectedCells.size === 1) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else {
                    console.log("Click on a selected tile to place the Theater.");
                    return;
                }
            }

            if (selectedBuilding === "Cottage") {
                if (selectedCells.has(this)) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else if (selectedCells.size === 1) {
                    placeBuilding(this, selectedBuilding);
                    selectedBuilding = null;
                    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("selected"));
                    updateBuildingReadiness();
                    return;
                } else {
                    console.log("Click on a selected tile to place the Cottage.");
                    return;
                }
            }


            // If a resource is selected, place it on the board
            if (selectedResource) {
                if (!this.hasChildNodes()) {
                    const newResource = document.createElement("div");
                    newResource.classList.add("resource-icon", selectedResource);
                    newResource.setAttribute("data-resource", selectedResource);
                    this.appendChild(newResource);
                    console.log("Placed resource:", selectedResource);
                    
                    //update grid from placed resource
                    //todo
                    const row = parseInt(this.dataset.row);
                    const col = parseInt(this.dataset.col);
                    gridState[row][col] = selectedResource;
                    console.log(`Updated gridState[${row}][${col}] = ${selectedResource}`);
                    console.table(gridState); // visualize grid state in console

2

                    // refresh market
                    marketRefresh(selectedResource);

                    // Clear selected resource after placement
                    selectedResource = null;
                    document.querySelectorAll(".resource-card").forEach(c => c.classList.remove("selected"));
                }
            } else {
                const row = this.getAttribute("data-row");
                const col = this.getAttribute("data-col");
                const key = `${row},${col}`;
                // Toggle grid selection if no resource is selected
                if (selectedCells.has(this)) {
                    delete selectedGridPositions[key];
                    selectedCells.delete(this);
                    this.classList.remove("selected");
                    console.log("Deselected grid cell.");
                } else {
                    selectedGridPositions[key] = true;
                    selectedCells.add(this);
                    this.classList.add("selected");
                    console.log("Selected grid cell.");
                }
            }

            // Debug print to check current dictionary
            console.log("Selected Positions:", Object.keys(selectedGridPositions));
            const bounds = getMinMaxCoords(selectedGridPositions);
            if (bounds) {
              const [minRow, maxRow, minCol, maxCol] = bounds;
              console.log(`Min Row: ${minRow}, Max Row: ${maxRow}`);
              console.log(`Min Col: ${minCol}, Max Col: ${maxCol}`);
            }
            const resourceString = getSelectedResourceGridString(selectedGridPositions);
            console.log("Resource layout string:", resourceString); // → e.g. "brickglass|.wheat"
            updateBuildingReadiness();
        });
    });
}


function getSelectedResourceGridString() {
    const keys = Object.keys(selectedGridPositions);
    if (keys.length === 0) return "";
  
    // Step 1: Get bounds
    const [minRow, maxRow, minCol, maxCol] = getMinMaxCoords(selectedGridPositions);
  
    // Step 2: Build string row by row
    let result = "";
  
    for (let row = minRow; row <= maxRow; row++) {
      if (row !== minRow) result += "|"; // add row separator
  
      for (let col = minCol; col <= maxCol; col++) {
        const key = `${row},${col}`;
        if (selectedGridPositions[key]) {
          const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
          const resource = cell?.firstChild?.getAttribute("data-resource");
          result += resource ? resource : ".";
        } else {
          result += ".";
        }
      }
    }
  
    return result;
  }
  

  function checkFarm(resourceString) {
    // List of valid farm patterns (row-wise string representation)
    const validFarmPatterns = [
      "wheatwheat|woodwood",
      "woodwood|wheatwheat",
      "wheatwood|wheatwood",
      "woodwheat|woodwheat"
    ];
  
    return validFarmPatterns.includes(resourceString);
  }
function checkWell(resourceString){
    const validFarmPatterns = [
        "woodstone",
        "stonewood",
        "wood|stone",
        "stone|wood"
      ];
    
      return validFarmPatterns.includes(resourceString);

}

function checkTheater(resourceString){
    const validFarmPatterns = [
        "woodglasswood|.stone.",
        ".stone.|woodglasswood",
        "wood.|glassstone|wood.",
        ".wood|stoneglass|.wood"
      ];
    
      return validFarmPatterns.includes(resourceString);

}

function checkTavern(resourceString){
    const validFarmPatterns = [
        "brickbrickwood",
        "woodbrickbrick",
        "brick|brick|wood",
        "wood|brick|brick"
      ];
    
      return validFarmPatterns.includes(resourceString);
}

function checkChapel(resourceString){
    const validFarmPatterns = [
        "..glass|stoneglassstone",
        "stoneglassstone|..glass",
        "glass..|stoneglassstone",
        "stoneglassstone|glasss..",
        "stoneglasss|glasss.|stone.",
        "glassstone|.glass|.stone",
        "stone.|glass.|stoneglass",
        ".stone|.glass|glassstone"
      ];
    
      return validFarmPatterns.includes(resourceString);

}

function checkFactory(resourceString){
    const validFarmPatterns = [
        "wood...|brickstonestonebrick",
        "brickstonestonebrick|wood...",
        "...wood|brickstonestonebrick",
        "brickstonestonebrick|...wood",
        "brickwood|stone.|stone.|wood.",
        "wood.|stone.|stone.|brickwood",
        "woodbrick|.stone|.stone|.brick",
        ".brick|.stone|.stone|woodbrick"
      ];
    
      return validFarmPatterns.includes(resourceString);

}
function checkCottage(resourceString){
    const validFarmPatterns = [
        ".wheat|brickglass",
        "brickglass|.wheat",
        "wheat.|glassbrick",
        "glassbrick|wheat.",
        "brick.|glasswheat",
        "glasswheat|brick.",
        ".brick|wheatglass",
        "wheatglass|.brick"
      ];
    
      return validFarmPatterns.includes(resourceString);

}

function checkCathedralOfCaterina(resourceString){
    const validFarmPatterns = [
        ".wheat|stoneglass",
        "stoneglass|.wheat",
        "wheat.|glassstone",
        "glassstone|wheat.",
        "stone.|glasswheat",
        "glasswheat|stone.",
        ".stone|wheatglass",
        "wheatglass|.stone"
      ];
    
      return validFarmPatterns.includes(resourceString);

}


function clearSelectionAfterPlacement() {
    // Clear selection object
    for (const key in selectedGridPositions) {
      delete selectedGridPositions[key];
    }
  
    // Clear visual selection and Set
    if (typeof selectedCells !== "undefined") {
      selectedCells.forEach(cell => cell.classList.remove("selected"));
      selectedCells.clear();
    } else {
      // fallback in case selectedCells isn't used
      document.querySelectorAll(".grid-cell.selected").forEach(cell => {
        cell.classList.remove("selected");
      });
    }
  
    // Reset selected resources array if applicable
    selectedResources = [];
  
    console.log("Selection cleared after building placement.");
  }
  