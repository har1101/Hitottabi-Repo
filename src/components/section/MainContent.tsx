import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { ChatViewArea } from "../ChatViewArea.tsx";
import { ChatInputArea } from "../ChatInputArea.tsx";
import { Hotel, HotelElement } from "../element/HotelElement.tsx";

import { convertNonNullableValue, isJsonParsable, Nullable } from "../../common.ts";
import { v4 as uuid } from "uuid";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../../amplify/data/resource.ts";
import { Message } from "../ChatMessage.tsx";


const client = generateClient<Schema>();

interface AgentRequest {
    sessionId: string,
    inputText: string,
}

interface AgentResponse {
    hotels: Hotel[]
}

enum AgentStatus {
    PENDING, // 未処理
    IN_PROGRESS, // 処理中
    COMPLETED// 完了
}

enum Agent {
    NONE = 'none',
    ACTIVITY = 'activity',
    HOTEL = 'hotel',
    FLIGHT = 'flight',
    USER = 'user',
    BOOKING = 'booking'
}

interface PlanCreationStatus {
    inProgressAgent: Agent.NONE | Agent.ACTIVITY | Agent.HOTEL | Agent.FLIGHT | Agent.USER | Agent.BOOKING
    activity: AgentStatus.PENDING | AgentStatus.IN_PROGRESS | AgentStatus.COMPLETED,
    hotel: AgentStatus.PENDING | AgentStatus.IN_PROGRESS | AgentStatus.COMPLETED,
    flight: AgentStatus.PENDING | AgentStatus.IN_PROGRESS | AgentStatus.COMPLETED,
    user: AgentStatus.PENDING | AgentStatus.IN_PROGRESS | AgentStatus.COMPLETED,
}

const inputAreaStyles = {
    active: {
        '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
            },
        }
    },
    inactive: {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#f0f0f0',
            borderRadius: '20px',
            '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
            },
        },
    }
};

const planCreationStatus: PlanCreationStatus = {
    inProgressAgent: Agent.NONE,
    activity: AgentStatus.PENDING,
    hotel: AgentStatus.PENDING,
    flight: AgentStatus.PENDING,
    user: AgentStatus.PENDING
}

export function MainContent(): React.JSX.Element {
    useEffect(() => {
        sessionStorage.setItem('sessionId', uuid())
    }, [])

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [inputAreaStyle, setInputAreaStyle] = useState(inputAreaStyles.active)
    const [isInputAreaDisabled, setIsInputAreaDisabled] = useState(false)

    /**
     * チャット反映
     * @param aiMessage
     */
    const render = (aiMessage: Message) => {
        setMessages((prev) => [...prev, aiMessage]);
    }

    /**
     * ホテル登録完了後
     */
    const onHotelRegistered = () => {
        setInputAreaStyle(inputAreaStyles.active)
        setIsInputAreaDisabled(false)

        planCreationStatus.hotel = AgentStatus.COMPLETED
        planCreationStatus.inProgressAgent = Agent.FLIGHT

        const aiMessage: Message = {
            id: uuid(),
            sender: 'ai',
            element: <>ホテル登録完了</>,
        };
        render(aiMessage)
    }

    /**
     * ユーザーの入力値を画面に反映
     * @param text
     */
    const renderUserMessage = (text: string) => {
        const userMessage: Message = {
            id: uuid(),
            sender: 'user',
            element: <>{text}</>,
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
                const request: AgentRequest = {
                    sessionId: sessionId,
                    inputText: text,
                }

                if (planCreationStatus.inProgressAgent == Agent.NONE) {
                    // ユーザーの入力に応じてどのホテル or アクティビティエージェントから呼び出すか判断するエージェントを呼び出す
                    const response = 'hotel'

                    switch (response) {
                        case Agent.HOTEL:
                            planCreationStatus.inProgressAgent = Agent.HOTEL;
                            break;
                    }
                }

                if (planCreationStatus.inProgressAgent == Agent.HOTEL) {
                    planCreationStatus.hotel = AgentStatus.IN_PROGRESS
                    const response = await client.queries.recommendationsHotels(request);
                    return response.data
                } else if (planCreationStatus.inProgressAgent == Agent.ACTIVITY) {
                    console.log('activity')
                } else if (planCreationStatus.inProgressAgent == Agent.FLIGHT) {
                    console.log('flight')
                } else if (planCreationStatus.inProgressAgent == Agent.USER) {
                    console.log('user')
                } else if (planCreationStatus.inProgressAgent == Agent.BOOKING) {
                    console.log('booking')
                }
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

        const convertedResponse: string = convertNonNullableValue(response)

        let element: React.JSX.Element = <></>;

        if (isJsonParsable(convertedResponse)) {
            const parsedResponse: AgentResponse = JSON.parse(convertedResponse)

            if ('hotels' in parsedResponse) {
                setInputAreaStyle(inputAreaStyles.inactive)
                setIsInputAreaDisabled(true)
                element = <HotelElement hotels={parsedResponse.hotels} onHotelRegistered={onHotelRegistered} />
            }
        } else {
            element = <>{convertedResponse}</>
        }

        const aiMessage: Message = {
            id: uuid(),
            sender: 'ai',
            element: element,
        };
        render(aiMessage)
    }

    /**
     * ユーザーの入力をエージェントに送信する
     */
    const sendMessage = async () => {
        if (!input.trim() || isSending) return;
        setIsSending(true);
        renderUserMessage(input);

        try {
            const response: Nullable<string> | undefined = await executeAgent(input)
            renderAIMessage(response)
        } finally {
            setIsSending(false);
        }
    }

    return (
        <Box component="main" sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        }}>
            <ChatViewArea messages={messages}/>
            <ChatInputArea
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
                inputAreaStyle={inputAreaStyle}
                isInputAreaDisabled={isInputAreaDisabled}
            />
        </Box>
    );
}
