import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  switch (event.httpMethod) {
    case "GET":
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "getting token" }),
      };
    default:
      break;
  }
  return {
    statusCode: 400,
    body: JSON.stringify(`unsupported method: ${event.httpMethod}`),
  };
}

export { handler };
