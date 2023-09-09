// import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Logger, injectLambdaContext } from "@aws-lambda-powertools/logger";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const logger = new Logger({
  logLevel: "INFO",
});

export const handler = async (event: APIGatewayProxyEvent) => {
  //   console.log(event);

  // 受け取ったevent.bodyがbase64エンコードされているのでデコード
  //   event2.body = Buffer.from(event.body!).toString("binary");

  // multipart/form-dataをパースする
  //   const multipartBuffer = multipart.parse(event2, true);

  // console.log(event.body);

  const encodedData = event.body || "";

  // data:image/png;base64,iVBORw0KGgoAAAANSUh......
  // ↓
  // iVBORw0KGgoAAAANSUh......
  const fileData = encodedData.replace(/^data:\w+\/\w+;base64,/, "");

  // const decodedFile = new Buffer(fileData, "base64");
  const decodedFile = Buffer.from(fileData, "base64");

  // console.log(decodedFile);
  // console.log(decodedFile1);

  const fileExtension = encodedData
    .toString()
    .slice(encodedData.indexOf("/") + 1, encodedData.indexOf(";"));

  // console.log(event2.body);
  //   console.log(multipartBuffer);
  //   console.log(multipartBuffer.file.content);

  // console.log(decodedFile);
  console.log(fileExtension);

  const s3 = new S3Client({});

  const filename = `${uuidv4()}.${fileExtension}`;

  const response = await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      Body: decodedFile,
    })
  );

  console.log(response);

  //   console.log(JSON.stringify(event, null, 2));
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,GET,PUT,DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify({
      filename: filename,
      filepath: `${process.env.S3_BUCKET_NAME}/${filename}`,
      cloudfront: `https://${process.env.CLOUDFRONT_URL}/${filename}`,
    }),
  };
};
