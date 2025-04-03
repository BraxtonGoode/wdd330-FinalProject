import { XMLParser } from 'fast-xml-parser';


const xmlapi2URL = import.meta.env.VITE_API_URL_BASE;
const xmlapiURL = import.meta.env.VITE_API_URL_NON;

// const baseURL = '/api/xmlapi2'; 

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
                name: game.name["@_value"], // Access the name property inside the object
                thumbnail: game.thumbnail["@_value"], // Access the thumbnail URL
                year: game.yearpublished["@_value"] // Access the year published
            }));

            console.log("Formatted games:", formattedGames); // Check the extracted data

            return formattedGames;
        } catch (error) {
            console.error("Error fetching top 20 games:", error);
        }
    }

    async fetchGameById(gameId) {
        try {
            console.log(xmlapiURL)
            // Use the proxy path for game by ID as well
            const response = await fetch(`${xmlapiURL}boardgame/${gameId}`);
            console.log('Response status:', response.status);


            console.log("Fetching game by ID:", gameId);

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
    // Initialize the XML parser
    const parser = new XMLParser({
        ignoreAttributes: false, // Ensure attributes are not ignored
        attributeNamePrefix: "@_", // Add a prefix to attributes (optional)
    });

    // Parse the XML string
    const jsonObj = parser.parse(xml);
    return jsonObj;
}