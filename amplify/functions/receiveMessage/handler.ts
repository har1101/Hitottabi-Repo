/*import { SQSEvent, Context, Callback } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import outputs from "../../../amplify_outputs.json"

const sns = new AWS.SNS();

export const handler = async (event: SQSEvent, context: Context, callback: Callback) => {
    const snsTopicArn = outputs.custom.sns.topicArn;

    for (const record of event.Records) {

        // メッセージからメールアドレスを取得
        const emailAddress = record.body;

        // const param = {
        //     Protocol: "email",
        //     TopicArn: snsTopicArn,
        //     Endpoint: emailAddress,
        //     Attributes: {
        //         FilterPolicy: JSON.stringify({
        //             targetEmail: [emailAddress]
        //         })
        //     }
        // }
        // await sns.subscribe(param, function (err, data) {
        //     if (err) {
        //         console.log(err, err.stack); // エラー処理
        //     } else {
        //         console.log(data); // サブスクリプションが成功した場合
        //     }
        // }).promise();


        try {
            // SNSを使って指定のメールアドレスにメッセージを送信
            await sns.publish({
                Message: 'この度は、「ひとったび」をご利用いただきありがとうございます。\nご予約のお申し込みを受理いたしました。\n現時点では予約は完了していません。予約完了次第、再度予約完了メールにてお知らせいたします。',
                Subject: '予約申込が完了しました',
                TopicArn: snsTopicArn,  // SNSトピックにメッセージを送信
                MessageAttributes: {
                    'targetEmail': {
                        DataType: 'String',
                        StringValue: emailAddress,
                    }
                },
            }).promise();
            console.log(`Email sent to ${emailAddress}`);
        }
        catch (error) {
            console.log(`publish error ${error}`)
        }
    }
};
*/