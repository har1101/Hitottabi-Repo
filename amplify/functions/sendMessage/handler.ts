import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import type { Schema } from "../../data/resource";

import outputs from "../../../amplify_outputs.json"

export const handler: Schema["sendMessage"]["functionHandler"] = async (event) => {
    const { sessionId } = event.arguments

    const params = {
        QueueUrl: outputs.custom.sqs.queueUrl,
        MessageBody: JSON.stringify({ sessionId }),
    };

    const sqsClient = new SQSClient({ region: "ap-northeast-1" });

        // メッセージ送信
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.log("Message sent successfully:", data.MessageId);
        return data.MessageId || null;
};
