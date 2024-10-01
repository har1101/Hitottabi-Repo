import { defineBackend } from '@aws-amplify/backend';
import * as iam from "aws-cdk-lib/aws-iam";
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { recommendationActivities } from "./functions/recommendationActivities/resource";
import { recommendationHotels } from "./functions/recommendationHotels/resource";
import { recommendationFlight } from "./functions/recommendationFlight/resource";
import { confirmUserInfo } from "./functions/confirmUserInfo/resource";
import { sendMessage } from './functions/sendMessage/resource';
import { receiveMessage } from './functions/receiveMessage/resource';
import { data } from "./data/resource"
import * as eventSources from 'aws-cdk-lib/aws-lambda-event-sources';


const backend = defineBackend({
    data,
    recommendationActivities: recommendationActivities,
    recommendationHotels: recommendationHotels,
    recommendationsFlight: recommendationFlight,
    confirmUserInfo: confirmUserInfo,
    sendMessage: sendMessage,
    receiveMessage: receiveMessage
});

const lambdas = [
    backend.recommendationActivities.resources.lambda,
    backend.recommendationHotels.resources.lambda,
    backend.recommendationsFlight.resources.lambda,
    backend.confirmUserInfo.resources.lambda
]

const sendLambda = backend.sendMessage.resources.lambda
const receiveLambda = backend.receiveMessage.resources.lambda

const customResourceStack = backend.createStack('MyCustomResources');

// SQS Queueの取得
const queue = sqs.Queue.fromQueueArn(customResourceStack, 'ExistingQueue', "arn:aws:sqs:ap-northeast-1:026090531931:Temp-Hitottabi")

receiveLambda.addEventSource(new eventSources.SqsEventSource(queue))

sendLambda.addToRolePolicy(
    new iam.PolicyStatement({
        sid: "AllowSQSSendMessage",
        actions: [
            "sqs:SendMessage"
        ],
        resources: ["arn:aws:sqs:ap-northeast-1:026090531931:*"],
    })
)

receiveLambda.addToRolePolicy(
    new iam.PolicyStatement({
        sid: "AllowSendEmail",
        actions: [
            "ses:SendEmail",
            "ses:SendRawEmail"
        ],
        resources: ["arn:aws:ses:ap-northeast-1:026090531931:*"],
    })
)

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
