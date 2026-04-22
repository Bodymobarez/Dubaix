import serverless from "serverless-http";
import { createExpressApp } from "../../server";

export const handler = serverless(createExpressApp());
