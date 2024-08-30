import { defineBackend } from '@aws-amplify/backend';
import * as iam from "aws-cdk-lib/aws-iam"
import { sayHello } from "./functions/say-hello/resource";
import { data } from "./data/resource"

const backend = defineBackend({
    data,
    sayHello
});

const sayHelloLambda = backend.sayHello.resources.lambda

const statement = new iam.PolicyStatement({
    sid: "AllowAgentForBedrockInvoke",
    actions: [
        "bedrock:InvokeAgent"
    ],
    resources: ["arn:aws:bedrock:ap-northeast-1:026090531931:agent-alias/*/*"], // 必要に応じて特定のモデルに制限可能
});

sayHelloLambda.addToRolePolicy(statement)

export default backend
