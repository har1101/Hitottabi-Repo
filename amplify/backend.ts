import { defineBackend } from '@aws-amplify/backend';
import * as cdk from 'aws-cdk-lib';
import * as iam from "aws-cdk-lib/aws-iam"
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as eventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { recommendationActivities } from "./functions/recommendationActivities/resource";
import { recommendationHotels } from "./functions/recommendationHotels/resource";
import { recommendationFlight } from "./functions/recommendationFlight/resource";
import { confirmUserInfo } from "./functions/confirmUserInfo/resource";
import { sendMessage } from "./functions/sendMessage/resource"
import { receiveMessage } from "./functions/receiveMessage/resource";

import { data } from "./data/resource"


const backend = defineBackend({
    data,
    recommendationActivities: recommendationActivities,
    recommendationHotels: recommendationHotels,
    recommendationsFlight: recommendationFlight,
    confirmUserInfo: confirmUserInfo,
    sendMessage: sendMessage,
    receiveMessage: receiveMessage,
});

const lambdas = [
    backend.recommendationActivities.resources.lambda,
    backend.recommendationHotels.resources.lambda,
    backend.recommendationsFlight.resources.lambda,
    backend.confirmUserInfo.resources.lambda,
]

const agentStatement = new iam.PolicyStatement({
    sid: "AllowAgentForBedrockInvoke",
    actions: [
        "bedrock:InvokeAgent"
    ],
    resources: ["arn:aws:bedrock:ap-northeast-1:026090531931:agent-alias/*/*"], // 必要に応じて特定のモデルに制限可能
});

for (const lambda of lambdas) {
    lambda.addToRolePolicy(agentStatement)
}

const customResourceStack = backend.createStack('MyCustomResources');
const planQueue = new sqs.Queue(customResourceStack, 'PlanQueue', {
    queueName: 'hitottabi-plan-queue',
    retentionPeriod: cdk.Duration.days(1),
    visibilityTimeout: cdk.Duration.seconds(60)
})

const receiveQueueLambda = backend.receiveMessage.resources.lambda

receiveQueueLambda.addEventSource(new eventSources.SqsEventSource(planQueue, {
    batchSize: 10
}))

const sqsStatement = new iam.PolicyStatement({
    sid: "AllowSQSSendMessage",
    actions: [
        "sqs:SendMessage"
    ],
    resources: ["arn:aws:sqs:ap-northeast-1:026090531931:*"],
});

backend.sendMessage.resources.lambda.addToRolePolicy(sqsStatement)

backend.addOutput({
    custom: {
        sqs: {
            queueUrl: planQueue.queueUrl
        }
    }
})

export default backend
