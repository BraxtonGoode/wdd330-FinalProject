import { loadHeaderFooter } from "./utilities";
import GameOfTheDay from "./gameOfTheDay.mjs";

// Initialize the GameOfTheDay class
const gameOfTheDay = new GameOfTheDay();

// load content
await loadHeaderFooter();
await gameOfTheDay.init();

