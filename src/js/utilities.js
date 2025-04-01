import ExternalServices from "./externalServices.mjs";
const service = new ExternalServices()

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

function topTwentyCardTemplate(game){
  return`<h2>${game.name}</h2>`

}

export async function topTwentyCards() {
  try {
      const games = await service.fetchTopTwentyGames();

      if (!games || games.length === 0) {
          console.log("No games found.");
          return;
      }

      let cardsHtml = '';

      // Loop through the games and create the HTML for each card
      for (let i = 0; i < 20; i++) {
          const game = games[i];

          // Generate the HTML for the current game
          const gameHtml = topTwentyCardTemplate(game);

          // Append the generated HTML to the cardsHtml string
          cardsHtml += gameHtml;
      }

      // Assuming you want to append the cards to an element in your HTML
      const cardsContainer = document.getElementById('gameList');
      if (cardsContainer) {
          cardsContainer.innerHTML = cardsHtml;
          console.log("Cards have been inserted into the DOM.");
      } else {
          console.log("Cards container not found.");
      }
  } catch (error) {
      console.error('Error fetching top 20 games:', error);
  }
}
