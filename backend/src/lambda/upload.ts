// import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log(event);
  //   console.log(event.body);
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "sample" }),
  };
};
