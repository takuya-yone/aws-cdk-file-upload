/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_lambda_nodejs as node_lambda } from "aws-cdk-lib";
import { aws_lambda as lambda } from "aws-cdk-lib";
import { aws_logs as logs } from "aws-cdk-lib";
import { aws_apigateway as apigw } from "aws-cdk-lib";
import { ScopedAws } from "aws-cdk-lib";
import { aws_s3 as s3 } from "aws-cdk-lib";
import { aws_iam as iam } from "aws-cdk-lib";
import { aws_cloudfront as cloudfront } from "aws-cdk-lib";

import * as path from "path";

export interface ApiGwConstructProps extends cdk.StackProps {
  s3bucket: s3.Bucket;
  cloudfront: cloudfront.Distribution;
}

export class ApiGwConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ApiGwConstructProps) {
    super(scope, id);
    const { accountId } = new ScopedAws(this);

    const s3AccessPolicy = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: ["s3:*"],
          resources: [
            props.s3bucket.bucketArn,
            props.s3bucket.arnForObjects("*"),
          ],
        }),
      ],
    });

    const fileUploadFunctinRole = new iam.Role(this, "FileUploadFunctinRole", {
      roleName: "FileUploadFunctinRole",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName("AWSXrayWriteOnlyAccess"),
      ],
      inlinePolicies: {
        s3AccessPolicy,
      },
    });

    const uploadlambda = new node_lambda.NodejsFunction(
      this,
      "StorageUploadFunction",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, "../../src/lambda/upload.ts"),
        handler: "handler",
        // memorySize: 256,
        timeout: cdk.Duration.seconds(60),
        tracing: lambda.Tracing.ACTIVE,
        retryAttempts: 0,
        logRetention: logs.RetentionDays.THREE_DAYS,
        role: fileUploadFunctinRole,
        architecture: lambda.Architecture.ARM_64,

        // insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_229_0,
        environment: {
          S3_BUCKET_NAME: props.s3bucket.bucketName,
          CLOUDFRONT_URL: props.cloudfront.domainName,
        },
      }
    );

    const nameRestApi = "Rest API with Lambda auth";
    const restApi = new apigw.RestApi(this, nameRestApi, {
      restApiName: `Rest_API_with_Lambda_auth`,
      deployOptions: {
        stageName: "v1",
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS, // this is also the default
      },
    });

    //API Gatewayにリクエスト先のリソースを追加
    const restApiHelloWorld = restApi.root.addResource("upload");

    //リソースにGETメソッド、Lambda統合プロキシを指定
    restApiHelloWorld.addMethod(
      "GET",
      new apigw.LambdaIntegration(uploadlambda)
    );
    restApiHelloWorld.addMethod(
      "POST",
      new apigw.LambdaIntegration(uploadlambda)
    );
  }
}
