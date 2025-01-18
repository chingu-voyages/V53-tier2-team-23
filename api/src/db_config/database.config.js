import { MongoClient, ServerApiVersion } from 'mongodb'; // import  MongoClient and ServerApiVersion classes from mongodb
const uri = process.env.MONGODB_URI; // get Atlas URI from env file
const db = 'eato_database';
if (!uri) {
  throw new Error(uri);
}
/*
create a variable that stores the MongoDB client instance after it connects to the database
in Serverless functionality every function call creates a new instance of the function. 
No caching MongoDB client -> new MongoDB connection established for each request
- increased Latency
- parallel opened multiple connections fill database's connection pool.
Caching MongoDB client
If the client has already been created -> ready to be reused.
If the client is null ->  create a new connection and assign it to cached client variable.

https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs
https://akhilaariyachandra.com/blog/using-mongodb-in-a-serverless-app
https://medium.com/@jgcmarins/node-js-serverless-aws-lambda-function-how-to-cache-mongodb-connection-and-reuse-it-between-6ec2fea0f465

*/
let cachedClient = null; // for serverless - comment if not

// create client instance using new MongoClient constructor
const client = new MongoClient(uri, {
  //serverAPI object uses MongoDB driver configuration to use the Server API for specific MongoDB versions compatibility.
  serverAPI: {
    version: ServerApiVersion.v1, // version 1 of the MongoDB Server API for compatibility.
    strict: true, //  MongoDB driver throws error for Server API version unsupported methods-features.
    deprecationErrors: true, // MongoDB driver throws error for Server API version deprecated methods-features.
  },
});

const getDb = async () => {
  if (cachedClient) {
    // Return cached client if it exists
    return cachedClient.db(`${db}`);
  }

  try {
    await client.connect(); // Connect to the MongoDB database
    cachedClient = client; // Cache the client for reuse
    console.log('MongoDB connection established successfully');
    return client.db(`${db}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error; // Rethrow the error to handle it appropriately in the calling function
  }
};

export default eato_database;
