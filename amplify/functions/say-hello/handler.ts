import type { Schema } from "../../data/resource"

import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand, InvokeAgentCommandInput,
    InvokeAgentCommandOutput, ResponseStream
} from "@aws-sdk/client-bedrock-agent-runtime";
import { convertNonNullableValue } from "../../../src/common";

export const handler: Schema["sayHello"]["functionHandler"] = async (event) => {
    const {inputText} = event.arguments

    const noNullableInputText = convertNonNullableValue(inputText)

    const params : InvokeAgentCommandInput = {
        agentId: "SRNGBSVDR3", // 使用するエージェントのIDを指定
        agentAliasId: "YFSIRT3IX8",
        sessionId: "ccc",
        inputText: noNullableInputText, // 入力テキストを設定
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
