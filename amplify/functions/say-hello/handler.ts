import type { Schema } from "../../data/resource"

import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

export const handler: Schema["sayHello"]["functionHandler"] = async (event) => {
    const { inputText } = event.arguments

    const params = {
        agentId: "***", // 使用するエージェントのIDを指定
        agentAliasId: "***",
        sessionId: "ccc",
        inputText: inputText, // 入力テキストを設定
    };

    const client = new BedrockAgentRuntimeClient({ region: "ap-northeast-1" });
    const command = new InvokeAgentCommand(params);
    const response = await client.send(command);

    const actualStream = response.completion.options.messageStream;
    for await (const value of actualStream) {
        const jsonString = new TextDecoder().decode(value.body);
        const base64encoded = JSON.parse(jsonString).bytes;
        const decodedString = Buffer.from(base64encoded,'base64').toString();
        console.log(decodedString)

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: decodedString
            }),
        };
    }
}
