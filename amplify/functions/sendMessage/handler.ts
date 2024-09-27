import type { Schema } from "../../data/resource"
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import outputs from "../../../amplify_outputs.json"

export const handler: Schema["sendMessage"]["functionHandler"] = async (event) => {
    const messageBody = event.arguments.inputText
    const sqsClient = new SQSClient({ region: 'ap-northeast-1' });
    const QUEUE_URL = "https://sqs.ap-northeast-1.amazonaws.com/026090531931/amplify-gen2app-node-sandbox-9f7f159acf-MyCustomRes-MyQueueE6CA6235-Cxmrjtriras9"
    /*const params = {
        QueueUrl: QUEUE_URL,
        MessageBody: messageBody,
    };
    
    try {
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.log('メッセージが送信されました:', data.MessageId);

        return `メッセージが正常に送信されました！ MessageId: ${data.MessageId}`
    } catch (error) {
        console.error('メッセージ送信エラー:', error);

        return `メッセージの送信に失敗しました! MessageId: ${error.message}`
    }*/
   return "test"
};
