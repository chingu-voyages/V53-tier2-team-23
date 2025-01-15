import jwt from "jsonwebtoken";

// CREDENTIALS
const manager = {
  username: "manager",
  password: "manager",
};

export default function handler(request, response) {
  if (request.method === "POST") {
    const { username, password } = request.body;

    // Create a data object to send as the response
    const data = {
      user: username,
      password: password,
    };

    return response.status(200).json(data); // Send the user and password as JSON
  }

  /* POST METHOD
  if (request.method === "POST") {
    const { username, password } = request.body;

    if (username === manager.username && password === manager.password) {
      const token = jwt.sign(
        { username: manager.username },
        process.env.JWT_SECRET
      );

      //response.setHeader("auth-token", token);
      response.setHeader("Authorization", `Bearer ${token}`);

      response.setHeader("Content-Type", "application/json");

      response.status(200).json({ token });
    } else {
      response.status(401).json({ message: "Credentials don't match" });
    }
  }
*/

  // GET METHOD
  // if (request.method === "GET") {
  //   const token = request.headers.authorization?.split(" ")[1];
  //   //const token = request.headers["auth-token"];
  //   if (!token) {
  //     return response.status(401).json({ message: "Token not found" });
  //   }

  //   try {
  //     const verified = jwt.verify(token, process.env.JWT_SECRET);

  //     const responseBody = JSON.stringify(verified);

  //     return {
  //       statusCode: 200,
  //       body: responseBody,
  //       headers: {
  //         "Content-Type": "application/json; charset=utf-8",
  //         "Access-Control-Allow-Origin": "*",
  //       },
  //     };

  //     // return response
  //     //   .status(200)
  //     //   .json({ message: "Manager content", manager: verified.username });
  //   } catch (error) {
  //     return response.status(401).json({ message: "Token not accepted" });
  //   }
  // }

  return response.status(405).json({ message: "Method Not Allowed" });
}
