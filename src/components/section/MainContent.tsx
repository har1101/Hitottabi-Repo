import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { ChatViewArea } from "../ChatViewArea.tsx";
import { ChatInputArea } from "../ChatInputArea.tsx";

import { convertNonNullableValue, isJsonParsable, Nullable } from "../../common.ts";
import { v4 as uuid } from "uuid";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../../amplify/data/resource.ts";

const client = generateClient<Schema>();

export interface Messages {
    messages: Message[]
}

export interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: React.JSX.Element;
}

const boxStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
}

export function MainContent(): React.JSX.Element {
    useEffect(() => {
        sessionStorage.setItem('sessionId', uuid())
    }, [])

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    /**
     * ユーザーの入力値を画面に反映
     * @param text
     */
    const renderUserMessage = (text: string) => {
        const userMessage: Message = {
            id: uuid(),
            sender: 'user',
            text: <>{text}</>,
        };
        setInput('');
        setMessages((prev) => [...prev, userMessage]);
    }

    /**
     * エージェント実行
     * @param text
     */
    const executeAgent = async (text: string) => {
        try {
            const sessionId = sessionStorage.getItem('sessionId')
            if (!sessionId) {
                console.log('The session ID is invalid.')
                return;
            } else {
                const response = await client.queries.recommendationsHotels({
                    sessionId: sessionId,
                    inputText: text
                });

                return response.data
            }
        } catch (error) {
            console.error('Failed to fetch text:', error);
        }
    }

    /**
     * 回答結果を整形して画面に反映
     * @param response
     */
    const renderAIMessage = (response: Nullable<string> | undefined) => {
        const render = (text: string) => {
            const botMessage: Message = {
                id: uuid(),
                sender: 'ai',
                text: <>{text}</>,
            };
            setMessages((prev) => [...prev, botMessage]);
        }

        try {
            const convertedResponse: string = convertNonNullableValue(response)
            if (isJsonParsable(convertedResponse)) {
                const parsedResponse = JSON.parse(convertedResponse)
                if ('hotels' in parsedResponse) {
                    render(convertedResponse)
                }
            } else {
                render(convertedResponse)
            }
        } catch (error) {
            if (error instanceof TypeError) {
                render('AIからの回答が異常な値を検出しました。しばらく待ってから再度お試しください。')
            }
        }
    }

    /**
     * ユーザーの入力をエージェントに送信する
     */
    const sendMessage = async () => {
        if (!input.trim()) return;

        renderUserMessage(input);

        const response: Nullable<string> | undefined = await executeAgent(input)

        renderAIMessage(response)
    }

    return (
        <Box component="main" sx={boxStyle}>
            <ChatViewArea messages={messages}/>
            <ChatInputArea input={input} setInput={setInput} sendMessage={sendMessage}/>
        </Box>
    );
}
