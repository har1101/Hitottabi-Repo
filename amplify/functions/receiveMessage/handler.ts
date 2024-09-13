import type { Handler } from 'aws-lambda';

export const handler: Handler = async (event, context) => {
    console.log(event, context)
    for (const record of event.Records) {
        const messageBody = record.body;
        console.log(`receiveQueue is ${messageBody}`);
    }
};
