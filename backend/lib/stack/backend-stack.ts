import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { StorageConstruct } from "../construct/storage";
import { ApiGwConstruct } from "../construct/apigw";

export class FileUpBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const storageConstruct = new StorageConstruct(this, "StorageConstruct");
    const apigweConstruct = new ApiGwConstruct(this, "ApiGwConstruct", {
      s3bucket: storageConstruct.s3bucket,
      cloudfront: storageConstruct.cloudfront,
    });
  }
}
