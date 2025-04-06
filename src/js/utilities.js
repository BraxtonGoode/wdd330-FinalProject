// Global imports and variables
import ExternalServices from "./externalServices.mjs";
const service = new ExternalServices();
let currentPage = 1; // Track the current page



async function loadTemplate(path) {
  const response = await fetch(path);

  const template = await response.text();
  return template;
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadHeaderFooter() {
  // Load header and footer templates
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");
  // Load header and footer elements
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  // render header and footer templates
  renderWithTemplate(headerTemplate, header);
  renderWithTemplate(footerTemplate, footer);
}

function CardTemplate(game) {
  const string = `
  <div id="topBoardGame">
  <p>Ranked at number ${game.rank} is:</p>
  <h2>${game.name}</h2>
  <a href="/boardgame/game.html?id=${game.id}">  
  <img class="gameImage" src="${game.thumbnail}" alt="${game.name}"></br>
  </a>
  <input type="hidden" value="${game.id}" />
  </div>
    `;
  return string;
}

export async function topTwentyCards() {
  try {
    const games = await service.fetchTopTwentyGames();

    if (!games || games.length === 0) {
      // no games found
      return;
    }

    let cardsHtml = "";

    // Loop through the games and create the HTML for each card
    for (let i = 0; i < 20; i++) {
      const game = games[i];

      // Generate the HTML for the current game
      const gameHtml = CardTemplate(game);

      // Append the generated HTML to the cardsHtml string
      cardsHtml += gameHtml;
    }

    //append the cards to an element in your HTML
    const cardsContainer = document.getElementById("gameList");
    if (cardsContainer) {
      cardsContainer.innerHTML = cardsHtml;
      console.log("Cards have been inserted into the DOM.");
    } else {
      console.log("Cards container not found.");
    }
  } catch (error) {
    console.error("Error fetching top 20 games:", error);
  }
}

export function indivCardTemplate(game) {
  // / Check if the name exists and is an array
  const gameNameObj = Array.isArray(game.boardgames?.boardgame?.name)
    ? game.boardgames?.boardgame?.name.find((n) => n["@_primary"] === "true")
    : game.boardgames?.boardgame?.name;

  // If name is found, use the #text value
  const gameName = gameNameObj ? gameNameObj["#text"] : "Unknown Game";

  // Straightforward items
  const description = game.boardgames.boardgame.description;
  const image = game.boardgames.boardgame.image;
  const maxPlayers = game.boardgames.boardgame.maxplayers;
  const minPlayers = game.boardgames.boardgame.minplayers;
  const duration = game.boardgames.boardgame.playingtime;

  const string = `
    <h1>${gameName}</h1>
    <img src="${image}" alt="${gameName}" width="400">
    <h2>Description:</h2>
    <p>${description}</p>
    <h2>Game Details:</h2>
    <p>Player count: ${minPlayers} - ${maxPlayers}</p>
    <p>Game duration: ${duration} minutes</p>
  `;
  return string;
}

export async function gameById() {
  try {
    const gameid = getGameIdFromURL();
    const game = await service.fetchGameById(gameid);
    let cardHTML = "";

    // Get the HTML template for the game details
    cardHTML = indivCardTemplate(game);

    // Append the cards to an element in your HTML
    const cardContainer = document.querySelector(".indivBoardGame");
    if (cardContainer) {
      console.log("Entering if block: appending card to DOM");
      cardContainer.innerHTML = cardHTML;
      console.log("Card has been inserted into the DOM.");
    } else {
      console.log("Card container not found.");
    }
  } catch (error) {
    console.error("Error fetching game details:", error);
  }
}
// Function to get the game ID from the URL
function getGameIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}



export async function gameByName(searchValue) {
  try {
    const cardsContainer = document.querySelector(".gameInventory");
    const pageNavigation = document.querySelector(".pagination");
    if (pageNavigation) {
      pageNavigation.innerHTML = ""; 
    }
    cardsContainer.innerHTML = "<h1>Searching for your results!</h1>";
    console.log("Searching for game:", searchValue);

    const games = await service.fetchGameByName(searchValue);
    // Check if the games array exists and has items
    if (!games.boardgames || !games.boardgames.boardgame || games.boardgames.boardgame.length === 0) {
      cardsContainer.innerHTML = "<h1>No games could be found by that name.</h1>";
      console.log("No games found.");
      return; // Exit the function early
    }
    const totalGames = games.boardgames.boardgame.length;

    // Calculate start and end indices for the current page
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;

    let cardsHTML = "";

    // Loop through the games for the current page
    for (let i = startIndex; i < endIndex && i < totalGames; i++) {
      const gameitem = games.boardgames.boardgame[i];
      console.log("Game item:", gameitem);
      if (gameitem) {
        const gameid = gameitem["@_objectid"];
        const game = await service.fetchGameById(gameid);

        // Generate the HTML for the current game
        const gameHtml = searchCardTemplate(game);

        // Append the generated HTML to the cardsHtml string
        cardsHTML += gameHtml;
      }
    }

    // Append the cards to an element in your HTML
    if (cardsContainer) {
      cardsContainer.innerHTML = cardsHTML;
      console.log("Cards have been inserted into the DOM.");
    } else {
      console.log("Cards container not found.");
    }

    // Add pagination controls
    addPaginationControls(totalGames);
  } catch (error) {
    console.error("Error fetching game details:", error);
  }
}

function addPaginationControls(totalGames) {
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = ""; // Clear existing controls

  // Add "Previous" button
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.addEventListener("click", () => {
      currentPage--;
      gameByName(document.querySelector("#search").value); // Re-fetch results
    });
    paginationContainer.appendChild(prevButton);
  }

  // Add "Next" button
  if (currentPage * 10 < totalGames) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => {
      currentPage++;
      gameByName(document.querySelector("#search").value); // Re-fetch results
    });
    paginationContainer.appendChild(nextButton);
  }
}

function searchCardTemplate(game) {
  console.log("Game object:", game);
  // / Check if the name exists and is an array
  const gameNameObj = Array.isArray(game.boardgames?.boardgame?.name)
    ? game.boardgames?.boardgame?.name.find((n) => n["@_primary"] === "true")
    : game.boardgames?.boardgame?.name;

  // If name is found, use the #text value
  const gameName = gameNameObj ? gameNameObj["#text"] : "Unknown Game";

  // Straightforward items
  const thumbnail = game.boardgames.boardgame.thumbnail;
  const gameId = game.boardgames.boardgame["@_objectid"];


  const string = `
    <div class="searchBoardGame">
      <h1>${gameName}</h1>
      <a href="/boardgame/game.html?id=${gameId}"> 
      <img class="gameImage" src="${thumbnail}" alt="${gameName}">
      </a>
    </div>
  `;
  return string;
}

// set local storage
export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value)); // Convert value to JSON string
}

// get local storage
export function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null; // Parse JSON string back to object/array
}