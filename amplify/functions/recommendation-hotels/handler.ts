import type { Schema } from "../../data/resource"

import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand, InvokeAgentCommandInput,
    InvokeAgentCommandOutput, ResponseStream
} from "@aws-sdk/client-bedrock-agent-runtime";

export const handler: Schema["recommendationsHotels"]["functionHandler"] = async (event) => {
    const {sessionId, inputText} = event.arguments

    const params : InvokeAgentCommandInput = {
        agentId: "SRNGBSVDR3", // 使用するエージェントのIDを指定
        agentAliasId: "PDVOTJEIKF",
        sessionId: sessionId,
        inputText: inputText, // 入力テキストを設定
    };

    const client = new BedrockAgentRuntimeClient({region: "ap-northeast-1"});
    const command = new InvokeAgentCommand(params);
    const response: InvokeAgentCommandOutput = await client.send(command);

    const completion: AsyncIterable<ResponseStream> = response.completion

    const actualStream = completion.options.messageStream;

    console.log("actualStream: " + actualStream)

    for await (const value of actualStream) {
        const jsonString = new TextDecoder().decode(value.body);
        const base64encoded = JSON.parse(jsonString).bytes;
        const decodedString = Buffer.from(base64encoded, 'base64').toString();
        console.log(decodedString)

        return decodedString;
    }
}
