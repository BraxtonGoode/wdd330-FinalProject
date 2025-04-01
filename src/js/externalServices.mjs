import { XMLParser } from 'fast-xml-parser';

const baseURL = 'https://www.boardgamegeek.com/xmlapi2';

export default class ExternalServices {
    constructor() {
        // Initialization logic if needed
    }

    async fetchTopTwentyGames() {
        try {
            // Fetching the hot board games
            const response = await fetch(`${baseURL}/hot?boardgame`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse the XML response text into JSON using fast-xml-parser
            const xmlText = await response.text();

            // Log XML to view
            // console.log("Raw XML response:", xmlText);

            // convert to json
            const newJson = await convertXMLtoJSON(xmlText)


            // Log the parsed result (JSON format)
            const games = newJson.items ? newJson.items.item : [];

        // Map through the games and extract the necessary details
        const formattedGames = games.map(game => ({
            id: game['@_id'],
            rank: game['@_rank'],
            name: game.name['@_value'], // Access the name property inside the object
            thumbnail: game.thumbnail['@_value'], // Access the thumbnail URL
            year: game.yearpublished['@_value'] // Access the year published
        }));

        console.log("Formatted games:", formattedGames); // Check the extracted data

        return formattedGames;

        } catch (error) {
            console.error('Error fetching top 20 games:', error);
        }
    }
}

async function convertXMLtoJSON(xml){
    // Initialize the XML parser
    const parser = new XMLParser({
        ignoreAttributes: false, // Ensure attributes are not ignored
        attributeNamePrefix: "@_", // Add a prefix to attributes (optional)
    });
    // Parse the XML string
    const jsonObj = parser.parse(xml);
    return jsonObj

}