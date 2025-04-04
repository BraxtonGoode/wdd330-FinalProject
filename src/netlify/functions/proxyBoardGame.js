const fetch = require('node-fetch');  // Use node-fetch to fetch data

exports.handler = async function(event, context) {
  const { gameId } = event.queryStringParameters;  // Get the gameId from query parameters
  const apiUrl = `https://boardgamegeek.com/xmlapi/boardgame/${gameId}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Game not found" }),
      };
    }

    const data = await response.text();  // Get XML data as text
    return {
      statusCode: 200,
      body: data,  // Return the data (you will parse it in the frontend)
      headers: {
        'Content-Type': 'text/xml',  // Make sure it's XML content
        'Access-Control-Allow-Origin': '*',  // Allow all origins (to avoid CORS issues)
        'Access-Control-Allow-Methods': 'GET, OPTIONS',  // Allow GET and OPTIONS methods
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',  // Allow headers
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching game data" }),
    };
  }
};
