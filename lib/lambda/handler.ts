import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { getSecret } from "../utils/utils";

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  switch (event.httpMethod) {
    case "GET":
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "validate token" }),
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

        if (creds.username === username && creds.password === password) {
          return {
            statusCode: 200,
            body: JSON.stringify({ message: "getting token" }),
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
