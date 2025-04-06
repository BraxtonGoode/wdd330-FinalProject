// imports
import {indivCardTemplate, getLocalStorage, setLocalStorage} from "./utilities.js";
import ExternalServices from "./externalServices.mjs";

const service = new ExternalServices();

export default class GameOfTheDay {
    constructor(){

    }

    init(){
        this.checkGameOfTheDay()
    }
    async checkGameOfTheDay() {
        const localStorageGame = getLocalStorage("gameOfTheDay"); 
        const today = new Date().toISOString().split("T")[0]; 
    
        if (localStorageGame && localStorageGame.date.split("T")[0] === today) {
            console.log("Game of the day from local storage:", localStorageGame); 
            // Load game of the day from local storage
            await this.loadGameOfTheDay(localStorageGame.id);
            return true; 
        } else {
            console.log("No game of the day found in local storage. Fetching a new one...");
            const randomNumber = Math.floor(Math.random() * 1000) + 1; 
            const gameData = { id: randomNumber, date: new Date().toISOString() }; 
            setLocalStorage("gameOfTheDay", gameData); 
            await this.loadGameOfTheDay(randomNumber);

            return false; 
        }
    }

    async loadGameOfTheDay(localStorageGameId) {
        const game = await this.getGameOfTheDay(localStorageGameId);
        const gameOfTheDayContainer = document.querySelector(".indivBoardGame");
        const gameOfTheDayTemplate = indivCardTemplate(game);
        gameOfTheDayContainer.innerHTML = gameOfTheDayTemplate;

        return;


    }
    async getGameOfTheDay(gameId) {
        let game;
        let isGameFound = false;
    
        while (!isGameFound) {
            console.log("Trying game ID:", gameId);
    
            try {
                // Fetch the game using the provided gameId
                game = await service.fetchGameById(gameId);
                console.log("Game details:", game);
    
                // Check if the game has an error message
                if (game.boardgames.boardgame.error && game.boardgames.boardgame.error["@_message"]) {
                    console.log(`No game found for ID ${gameId}. Trying the next ID...`);
                    gameId++; // Increment the gameId to try the next one
                } else {
                    console.log("Game found!");
                    isGameFound = true; // Exit the loop
    
                    // Set the valid game as the new game of the day in local storage
                    const gameData = { id: gameId, date: new Date().toISOString() };
                    setLocalStorage("gameOfTheDay", gameData);
                }
            } catch (error) {
                console.error(`Error fetching game with ID ${gameId}:`, error);
                gameId++; // Increment the gameId to try the next one in case of an error
            }
        }
    
        // Return the valid game
        return game;
    }

}