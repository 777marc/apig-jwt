import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  LambdaIntegration,
  RestApi,
  CognitoUserPoolsAuthorizer,
  MethodOptions,
  AuthorizationType,
} from "aws-cdk-lib/aws-apigateway";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export class ApigJwtStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const jwtLambda = new NodejsFunction(this, "JwtLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: join(__dirname, "lambda", "handler.ts"),
    });

    const api = new RestApi(this, "JwtApi");
    const jwtResource = api.root.addResource("jwtapi");
    jwtResource.addMethod("POST", new LambdaIntegration(jwtLambda));
  }
}
