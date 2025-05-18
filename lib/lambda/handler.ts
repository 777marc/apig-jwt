import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { getSecret } from "../utils/utils";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  switch (event.httpMethod) {
    case "GET":
      const authToken = event.headers.Authorization || "";

      if (!authToken) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "no token" }),
        };
      }

      const token = authToken.replace("Bearer ", "");
      const SECRET_KEY = process.env.SECRET_KEY || "abc123";
      console.log("SECRET_KEY:", SECRET_KEY);
      const decoded = jwt.verify(token, SECRET_KEY);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: decoded }),
      };

    case "POST":
      const secret = await getSecret();
      let creds;

      if (secret) {
        creds = JSON.parse(secret);
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify(`missing params`),
        };
      }

      if (event.body) {
        const { username, password } = JSON.parse(event.body);
        const SECRET_KEY = process.env.SECRET_KEY || "abc123";
        console.log("SECRET_KEY:", SECRET_KEY);

        if (creds.username === username && creds.password === password) {
          const token = jwt.sign(
            { username, role: { name: "user", section: [] } },
            SECRET_KEY,
            { expiresIn: "1h" }
          );
          return {
            statusCode: 200,
            body: JSON.stringify({ token }),
          };
        } else {
          return {
            statusCode: 401,
            body: JSON.stringify({ message: "unauthorized" }),
          };
        }
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify(`missing params`),
        };
      }

    default:
      break;
  }
  return {
    statusCode: 400,
    body: JSON.stringify(`unsupported method: ${event.httpMethod}`),
  };
}

export { handler };
