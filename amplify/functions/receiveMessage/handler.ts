import { SQSEvent } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// const sns = new AWS.SNS();
const sesClient = new SESClient( "ap-northeast-1" );

export type Message = {
    subject: string;
    body: string;
    recipient: string;
};

const sendEmail = async (recipient) => {

    const command = new SendEmailCommand({
        Source: "no-reply@hitottabi.com",
        Destination: {
            ToAddresses: [recipient],
        },
        Message: {
            Body: {
                Text: { Data: "この度は、「ひとったび」をご利用いただきありがとうございます。\nご予約のお申し込みを受理いたしました。\n現時点では予約は完了していません。予約完了次第、再度予約完了メールにてお知らせいたします。" }
            },
            Subject: { Data: "予約申込が完了しました" }
        }
    });

    try {
        const result = await sesClient.send(command);
        console.log(`Email sent to ${recipient}: ${result.MessageId}`);
    } catch (error) {
        console.error(`Error sending email to ${recipient}: ${error}`);
        throw new Error(`Failed to send email to ${recipient}`);
    }
}

export const handler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        const emailAddress = record.body;

        // send the message via email
        await sendEmail(emailAddress);
    }
};
