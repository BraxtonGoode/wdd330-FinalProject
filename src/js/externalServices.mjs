import { XMLParser } from 'fast-xml-parser';

const xmlapi2URL = import.meta.env.VITE_API_URL;
const xmlapiURL = import.meta.env.VITE_API_URL_NON;


export default class ExternalServices {
    constructor() {
        // Initialization logic if needed
    }

    async fetchTopTwentyGames() {
        try {
            // Now the fetch request uses the Vite proxy path
            const response = await fetch(`${xmlapi2URL}hot?boardgame`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse the XML response text into JSON using fast-xml-parser
            const xmlText = await response.text();

            // Convert XML to JSON
            const newJson = await convertXMLtoJSON(xmlText);

            // Log the parsed result (JSON format)
            const games = newJson.items ? newJson.items.item : [];

            // Map through the games and extract the necessary details
            const formattedGames = games.map(game => ({
                id: game["@_id"],
                rank: game["@_rank"],
                name: game.name["@_value"], 
                thumbnail: game.thumbnail["@_value"], 
                year: game.yearpublished["@_value"] 
            }));

            return formattedGames;
        } catch (error) {
            console.error("Error fetching top 20 games:", error);
        }
    }

    async fetchGameById(gameId) {
        try {
            // Use the proxy path for game by ID as well
            const response = await fetch(`${xmlapiURL}boardgame/${gameId}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse the XML response text into JSON using fast-xml-parser
            const xmlText = await response.text();

            // Convert XML to JSON
            const newJson = await convertXMLtoJSON(xmlText);

            // Log the parsed result (JSON format)
            return newJson

        } catch (error) {
            console.error("Error fetching game by ID:", error);
        }
    }
    async fetchGameByName(searchValue) {
        try {
            // Use the proxy path for game by ID as well

            const response = await fetch(`${xmlapiURL}search?search=${searchValue}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse the XML response text into JSON using fast-xml-parser
            const xmlText = await response.text();

            // Convert XML to JSON
            const newJson = await convertXMLtoJSON(xmlText);

            // Log the parsed result (JSON format)
            console.log("Game details:", newJson);
            return newJson

        } catch (error) {
            console.error("Error fetching game by ID:", error);
        }
    }
}

// Convert XML string to JSON using fast-xml-parser
async function convertXMLtoJSON(xml) {
    const parser = new XMLParser({
        ignoreAttributes: false, // Ensure attributes are not ignored
        attributeNamePrefix: "@_", // Add a prefix to attributes (optional)
    });

    // Parse the XML string
    const jsonObj = parser.parse(xml);
    return jsonObj;
}