import { defineBackend } from '@aws-amplify/backend';
import * as cdk from 'aws-cdk-lib';
import * as iam from "aws-cdk-lib/aws-iam";
import * as sns from 'aws-cdk-lib/aws-sns';
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
// SQS Queueの作成
const queue = new sqs.Queue(customResourceStack, 'MyQueue', {
    visibilityTimeout: cdk.Duration.seconds(60),
});
// SNS Topicの作成
const topic = new sns.Topic(customResourceStack, 'MyTopic', {
    displayName: 'Customer notification topic',
});

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

backend.addOutput({
    custom:{
        queue:{queueUrl: queue.queueUrl},
        sns: {topicArn: topic.topicArn}
    }
})

receiveLambda.addToRolePolicy(
    new iam.PolicyStatement({
        sid: "AllowPublishToMyTopic",
        actions: [
            "sns:Publish",
            "sns:Subscribe",
            "sns:CreateTopic"
        ],
        resources: ["arn:aws:sns:ap-northeast-1:026090531931:*"],
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
