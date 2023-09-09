/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_lambda_nodejs as node_lambda } from "aws-cdk-lib";
import { aws_s3 as s3 } from "aws-cdk-lib";

// export interface EventBridgeConstructProps extends cdk.StackProps {
//   sechubSsmFunctin: node_lambda.NodejsFunction;
// }

export class StorageConstruct extends Construct {
  public s3bucket: s3.Bucket;
  constructor(scope: Construct, id: string, props?: {}) {
    super(scope, id);

    // set lambda as sqs queue target
    this.s3bucket = new s3.Bucket(this, "uploadedfile");
  }
}
