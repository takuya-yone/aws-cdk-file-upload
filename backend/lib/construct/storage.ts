/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_lambda_nodejs as node_lambda } from "aws-cdk-lib";
import { aws_s3 as s3 } from "aws-cdk-lib";
import { aws_cloudfront as cloudfront } from "aws-cdk-lib";
import { aws_cloudfront_origins as origins } from "aws-cdk-lib";
import { aws_iam as iam } from "aws-cdk-lib";

// export interface EventBridgeConstructProps extends cdk.StackProps {
//   sechubSsmFunctin: node_lambda.NodejsFunction;
// }

export class StorageConstruct extends Construct {
  public s3bucket: s3.Bucket;
  public cloudfront: cloudfront.Distribution;
  constructor(scope: Construct, id: string, props?: {}) {
    super(scope, id);

    this.s3bucket = new s3.Bucket(this, "uploadedfileS3");

    // const originAccessIdentity = new cdk.aws_cloudfront.OriginAccessIdentity(
    //   this,
    //   "OriginAccessIdentity"
    // );

    // const bucketPolicyStatement = new cdk.aws_iam.PolicyStatement({
    //   actions: ["s3:GetObject"],
    //   effect: cdk.aws_iam.Effect.ALLOW,
    //   principals: [
    //     new cdk.aws_iam.CanonicalUserPrincipal(
    //       originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
    //     ),
    //   ],
    //   resources: [`${this.s3bucket.bucketArn}/*`],
    // });

    // // set lambda as sqs queue target
    // const bucketPolicy = new s3.BucketPolicy(this, "WebsiteBucketPolicy", {
    //   bucket: this.s3bucket,
    // });
    // const cloudfrontOai = new cloudfront.OriginAccessIdentity(
    //   this,
    //   "CloudFrontOAI"
    // );

    // bucketPolicy.document.addStatements(
    //   new iam.PolicyStatement({
    //     actions: ["s3:GetObject"],
    //     effect: iam.Effect.ALLOW,
    //     principals: [
    //       new iam.CanonicalUserPrincipal(
    //         cloudfrontOai.cloudFrontOriginAccessIdentityS3CanonicalUserId
    //       ),
    //     ],
    //     resources: [`${this.s3bucket.bucketArn}/*`],
    //   })
    // );
    // this.s3bucket.grantRead(cloudfrontOai);

    this.cloudfront = new cloudfront.Distribution(this, "uploadedfileCF", {
      defaultBehavior: { origin: new origins.S3Origin(this.s3bucket) },
      // defaultBehavior: {
      //   origin: new origins.S3Origin(this.s3bucket, {
      //     originAccessIdentity: cloudfrontOai,
      //   }),
      // },
    });
  }
}
