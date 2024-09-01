import { defineBackend } from '@aws-amplify/backend';
import * as iam from "aws-cdk-lib/aws-iam"
import { recommendationsHotels } from "./functions/recommendation-hotels/resource";
import { data } from "./data/resource"

const backend = defineBackend({
    data,
    recommendationsHotels: recommendationsHotels
});

const recommendationsHotelsLambda = backend.recommendationsHotels.resources.lambda

const statement = new iam.PolicyStatement({
    sid: "AllowAgentForBedrockInvoke",
    actions: [
        "bedrock:InvokeAgent"
    ],
    resources: ["arn:aws:bedrock:ap-northeast-1:026090531931:agent-alias/*/*"], // 必要に応じて特定のモデルに制限可能
});

recommendationsHotelsLambda.addToRolePolicy(statement)

backend.addOutput({
    custom: {
        recommendationsHotels: {
            functionName: recommendationsHotelsLambda.functionName,
        }
    }
})

export default backend
