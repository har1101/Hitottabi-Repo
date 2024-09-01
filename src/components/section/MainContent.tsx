import React, { useEffect, useState } from 'react';
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';


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
    element: React.JSX.Element;
}

interface Hotel {
    name: string,
    description: string
}

interface AgentResponse {
    hotels: Hotel[]
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
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

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


        const render = (aiMessage: Message) => {
            setMessages((prev) => [...prev, aiMessage]);
        }

        const hotelsElement = (hotels: Hotel[]) => {

            const changeSelectedHotel = (event: React.ChangeEvent<HTMLInputElement>) => {
                const selected = hotels.find(hotel => hotel.name === event.target.value) || null;
                setSelectedHotel(selected);
            }

            return (
                <FormControl component="fieldset">
                    <FormLabel id="radio-group-hotels">Select a Hotel</FormLabel>
                    <RadioGroup
                        aria-labelledby="radio-group-hotels"
                        name="hotels"
                        onChange={changeSelectedHotel}
                    >
                        {hotels.map((hotel) => (
                            <FormControlLabel
                                key={hotel.name}
                                value={hotel.name}
                                control={<Radio />}
                                label={
                                    <Box mt={2}>
                                        <Box>{hotel.name}</Box>
                                        <Box>{hotel.description}</Box>
                                    </Box>
                                }
                            />
                        ))}
                    </RadioGroup>
                    {selectedHotel && (
                        <Box mt={2}>
                            <h3>Selected Hotel:</h3>
                            <Box>{selectedHotel.name}</Box>
                            <Box>{selectedHotel.description}</Box>
                        </Box>
                    )}
                </FormControl>
            )
        };

        const convertedResponse: string = convertNonNullableValue(response)

        let element: React.JSX.Element = <></>;

        if (isJsonParsable(convertedResponse)) {
            const parsedResponse: AgentResponse = JSON.parse(convertedResponse)

            if ('hotels' in parsedResponse) {
                element = hotelsElement(parsedResponse.hotels)
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
        if (!input.trim()) return;

        console.log(selectedHotel);

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
