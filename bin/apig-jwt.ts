#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ApigJwtStack } from "../lib/apig-jwt-stack";

const app = new cdk.App();
new ApigJwtStack(app, "ApigJwtStack");
