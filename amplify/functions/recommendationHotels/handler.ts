import type { Schema } from "../../data/resource"

import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand,
    InvokeAgentCommandInput,
    InvokeAgentCommandOutput,
    ResponseStream
} from "@aws-sdk/client-bedrock-agent-runtime";


export const handler: Schema["recommendationHotels"]["functionHandler"] = async (event) => {
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

    if (!response.completion) {
        console.error("No completion stream found in the response");
        return null; // completionが存在しない場合はnullを返す
    }

    const completion: AsyncIterable<ResponseStream> = response.completion;
    const actualStream = completion.options.messageStream;
    let finalResponse: string | null = null; // 最終的なレスポンスを格納

    for await (const value of actualStream) {
        const jsonString = new TextDecoder().decode(value.body);
        const base64encoded = JSON.parse(jsonString).bytes;
        finalResponse = Buffer.from(base64encoded, 'base64').toString();
    }

    return finalResponse;
}
