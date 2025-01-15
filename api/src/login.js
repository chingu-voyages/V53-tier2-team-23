const jwt = require("jsonwebtoken");

// CREDENTIALS
const manager = {
  username: "manager",
  password: "manager",
};

exports.handler = async (event) => {
  // set request object
  const request = {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body ? JSON.parse(event.body) : null,
    query: event.queryStringParameters,
  };

  //POST METHOD

  if (request.method === "POST") {
    const { username, password } = request.body;

    if (username === manager.username && password === manager.password) {
      const token = jwt.sign(
        { username: manager.username },
        process.env.JWT_SECRET
      );

      // Create a data object to send as the response
      const data = {
        username: username,
        password: password,
        token: token,
      };

      return {
        statusCode: 200,
        body: JSON.stringify({ data }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Credentials don't match" }),
      };
    }
  }

  // GET METHOD
  if (request.method === "GET") {
    const token = request.headers.authorization?.split(" ")[1];
    //const token = request.headers["auth-token"];
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Token not found" }),
      };
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);

      const responseBody = JSON.stringify(verified);

      return {
        statusCode: 200,
        body: responseBody,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      };

    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: Token not accepted" }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Method Not Allowed" }),
  };
};
