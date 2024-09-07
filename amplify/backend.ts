import { defineBackend } from '@aws-amplify/backend';
import * as iam from "aws-cdk-lib/aws-iam"
import { recommendationActivities } from "./functions/recommendationActivities/resource";
import { recommendationHotels } from "./functions/recommendationHotels/resource";
import { recommendationFlight } from "./functions/recommendationFlight/resource";
import { confirmUserInfo } from "./functions/confirmUserInfo/resource";

import { data } from "./data/resource"


const backend = defineBackend({
    data,
    recommendationActivities: recommendationActivities,
    recommendationHotels: recommendationHotels,
    recommendationsFlight: recommendationFlight,
    confirmUserInfo: confirmUserInfo,
});

const lambdas = [
    backend.recommendationActivities.resources.lambda,
    backend.recommendationHotels.resources.lambda,
    backend.recommendationsFlight.resources.lambda,
    backend.confirmUserInfo.resources.lambda
]

const statement = new iam.PolicyStatement({
    sid: "AllowAgentForBedrockInvoke",
    actions: [
        "bedrock:InvokeAgent"
    ],
    resources: ["arn:aws:bedrock:ap-northeast-1:026090531931:agent-alias/*/*"], // 必要に応じて特定のモデルに制限可能
});

for (const lambda of lambdas) {
    lambda.addToRolePolicy(statement)
}

export default backend
