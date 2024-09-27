import { AppSyncResolverEvent } from "aws-lambda";
import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand, InvokeAgentCommandInput,
    InvokeAgentCommandOutput
} from "@aws-sdk/client-bedrock-agent-runtime";

export const executeAgent = async (
    event: AppSyncResolverEvent<{
        sessionId: string,
        inputText: string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, Record<string, any> | null>, agentId: string, agentAliasId: string) => {

    const {sessionId, inputText} = event.arguments
    const params: InvokeAgentCommandInput = {
        agentId: agentId,
        agentAliasId: agentAliasId,
        sessionId: sessionId,
        inputText: inputText,
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
