import ExternalServices from "./externalServices.mjs";
const service = new ExternalServices();

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

function indivCardTemplate(game) {
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

function getGameIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}
