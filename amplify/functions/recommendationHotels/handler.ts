import type { Schema } from "../../data/resource"

import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand,
    InvokeAgentCommandInput,
    InvokeAgentCommandOutput
} from "@aws-sdk/client-bedrock-agent-runtime";

export const handler: Schema["recommendationHotels"]["functionHandler"] =
    async (event) => {
    const {sessionId, inputText} = event.arguments

    const params: InvokeAgentCommandInput = {
        agentId: "SRNGBSVDR3", // 使用するエージェントのIDを指定
        agentAliasId: "PDVOTJEIKF",
        sessionId: sessionId,
        inputText: inputText, // 入力テキストを設定
    };

    const client = new BedrockAgentRuntimeClient({region: "ap-northeast-1"});
    const command = new InvokeAgentCommand(params);

    let response = "";
    const agentResponse: InvokeAgentCommandOutput = await client.send(command);

    if (agentResponse.completion === undefined) {
        throw new Error("Completion is undefined");
    }

    for await (const chunkEvent of agentResponse.completion) {
        const chunk = chunkEvent.chunk;
        const decodedResponse = new TextDecoder("utf-8").decode(chunk?.bytes);
        console.log(decodedResponse);
        response += decodedResponse;
    }
    return response
}
