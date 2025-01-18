const getDb = require('./db_config/database.config.js'); // import getDatabase database from connection
const { ObjectId } = require('mongodb'); // import ObjectId method to convert the _id field value to string [ https://www.mongodb.com/docs/manual/reference/method/ObjectId/ ]

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const handler = async (event, context) => {
  //async function handler(event, context) {
  const { httpMethod, path, queryStringParameters, body } = event;

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers, // Return CORS headers for preflight
      body: JSON.stringify({ success: true }),
    };
  }

  console.log('HTTP Method:', httpMethod);
  console.log('Path:', path);
  console.log('Request body:', body);

  if (httpMethod === 'GET' && path.endsWith('/dishes')) {
    try {
      const dishes = await getData('dishes');
      return {
        statusCode: 200,
        headers, // Include the headers in the response
        body: JSON.stringify({ success: true, data: dishes }),
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'An internal server error occurred.',
          error: error.message, // Include error details for debugging
        }),
      };
    }
  }

  return {
    statusCode: 405,
    headers, // Include the headers in the response
    body: JSON.stringify({
      success: false,
      message: 'Method Not Allowed',
    }),
  };
};

// GET request handler for all projects
async function getData(collection_value) {
  const db = await getDb();
  const collection = await db.collection(collection_value);
  const data = await collection.find({}).toArray();

  // Debugging output to check the fetched data
  console.log('Fetched dishes:', data);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(data),
  };
}

module.exports.handler = handler;
