import { loadHeaderFooter, topTwentyCards, gameById } from "./utilities";

// load content
await loadHeaderFooter();
await topTwentyCards();

// main page button
document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("gameImage")) {
    const hiddenInput = e.target
      .closest("#topBoardGame")
      .querySelector('input[type="hidden"]');

    // Get the value of the hidden input (game ID)
    const gameId = hiddenInput ? hiddenInput.value : null;

    if (gameId) {
      gameById(gameId);
      e.preventDefault();
      window.location.href = `/boardgame/game.html?id=${gameId}`;
    } else {
      console.error("Game ID not found!");
    }
  }
});
