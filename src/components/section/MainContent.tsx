import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';

import { ChatViewArea } from "../ChatViewArea.tsx";
import { ChatInputArea } from "../ChatInputArea.tsx";
import { Hotel, HotelElement } from "../element/HotelElement.tsx";

import { convertNonNullableValue, isJsonParsable, Nullable } from "../../common.ts";
import { v4 as uuid } from "uuid";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../../amplify/data/resource.ts";
import { Message } from "../ChatMessage.tsx";
import { Flight, FlightElement } from '../element/FlightElement.tsx';
import { Activity, ActivityElement } from "../element/ActivityElement.tsx";


const client = generateClient<Schema>();

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

export interface Plan {
    travelBasic: TravelBasic | null
    activity: Activity | null
    hotel: Hotel | null
    flight: Flight | null
    // user: User | null
}

interface TravelBasic {
    outbound: {
        location: string
        date: string
    }
    inbound: {
        location: string
        date: string
    }
    people: {
        adults: number
        children: number
        infants: number
    }
}


interface AgentRequest {
    sessionId: string,
    inputText: string,
}


interface AgentResponse {
    travelBasic: TravelBasic | null
    activities: Activity[] | null
    hotels: Hotel[] | null
    flight: Flight | null
    // user: User | null
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

const plan: Plan = {
    travelBasic: null,
    activity: null,
    hotel: null,
    flight: null,
    // user: null
}

const planCreationStatus: PlanCreationStatus = {
    inProgressAgent: Agent.NONE,
    activity: AgentStatus.PENDING,
    hotel: AgentStatus.PENDING,
    flight: AgentStatus.PENDING,
    user: AgentStatus.PENDING
}

export function MainContent(): React.JSX.Element {
    useEffect(() => {
        const sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionStorage.setItem('sessionId', uuid());
        }
    }, [])

    const [messages, setMessages] = useState<Message[]>([]);
    const [isRenderUserMessage, setIsRenderUserMessage] = useState(false);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [inputAreaStyle, setInputAreaStyle] = useState(inputAreaStyles.active)
    const [isInputAreaDisabled, setIsInputAreaDisabled] = useState(false)

    useEffect(() => {
        if (isRenderUserMessage) {
            setInput('');
            setIsRenderUserMessage(false);
        }
    }, [isRenderUserMessage]);

    /**
     * チャット反映
     * @param aiMessage
     */
    const render = (aiMessage: Message) => {
        setMessages((prev) => [...prev, aiMessage]);
    }


    /**
     * プランをDBへ登録
     * @param plan
     */
    const registerPlanToDB = async (plan: Plan) => {
        const sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            console.log('The session ID is invalid.')
            return;
        }

        const planData = {
            PK: sessionId,
            SK: 'test',
            TravelBasic: plan.travelBasic ? {
                outbound: {
                    location: plan.travelBasic.outbound.location,
                    date: plan.travelBasic.outbound.date
                },
                inbound: {
                    location: plan.travelBasic.inbound.location,
                    date: plan.travelBasic.inbound.date
                },
                people: {
                    adults: plan.travelBasic.people.adults || 0,
                    children: plan.travelBasic.people.children || 0,
                    infants: plan.travelBasic.people.infants || 0
                }
            } : {},
            Activity: plan.activity ? {
                name: plan.activity.name,
                description: plan.activity.description
            } : {},
            Hotel: plan.hotel ? {
                name: plan.hotel.name,
                description: plan.hotel.description
            } : {},
            Flight: plan.flight ? {
                outbound: {
                    airport: plan.flight.outbound.airport,
                    number: plan.flight.outbound.number,
                    startTime: plan.flight.outbound.startTime,
                    endTime: plan.flight.outbound.endTime,
                    seats: plan.flight.outbound.seats.map(seat => JSON.stringify(seat))
                },
                inbound: {
                    airport: plan.flight.inbound.airport,
                    number: plan.flight.inbound.number,
                    startTime: plan.flight.inbound.startTime,
                    endTime: plan.flight.inbound.endTime,
                    seats: plan.flight.inbound.seats.map(seat => JSON.stringify(seat))
                },
            } : {}
        };


        const response = (await client.models.Plan.get({PK: sessionId, SK: 'test'})).data

        if (response) {
            await client.models.Plan.update(planData);
        } else {
            await client.models.Plan.create(planData);
        }
    }


    /**
     * ホテル登録完了後
     */
    const onHotelRegistered = async () => {
        setInputAreaStyle(inputAreaStyles.active)
        setIsInputAreaDisabled(false)

        planCreationStatus.hotel = AgentStatus.COMPLETED
        planCreationStatus.inProgressAgent = Agent.FLIGHT

        await sendMessage('旅行がしたい', false)
    }

    /**
     * アクティビティ登録完了後
     */
    const onActivityRegistered = async () => {
        setInputAreaStyle(inputAreaStyles.active)
        setIsInputAreaDisabled(false)

        planCreationStatus.activity = AgentStatus.COMPLETED
        planCreationStatus.inProgressAgent = Agent.HOTEL

        await sendMessage('旅行がしたい', false)
    }

    const onFlightRegistered = async () => {
        setInputAreaStyle(inputAreaStyles.active)
        setIsInputAreaDisabled(false)

        planCreationStatus.flight = AgentStatus.COMPLETED

        if (planCreationStatus.hotel == AgentStatus.COMPLETED &&
            planCreationStatus.activity == AgentStatus.COMPLETED &&
            planCreationStatus.flight == AgentStatus.COMPLETED
        ) {

            const element = (
                <Box>
                    <Box mb={2}>続いて個人情報の入力をお願いします。</Box>
                    <Button variant="contained" color="primary" sx={{mx: 1}}>
                        ユーザー情報を入力する
                    </Button>
                </Box>
            )

            const aiMessage: Message = {
                id: uuid(),
                sender: 'ai',
                element: element,
            };
            render(aiMessage)
        }
    }

    /**
     * ユーザーの入力値を画面に反映
     * @param text
     * @param isRender
     */
    const renderUserMessage = (text: string, isRender: boolean) => {
        const userMessage: Message = {
            id: uuid(),
            sender: 'user',
            element: <>{text}</>,
        };

        if (isRender) {
            setMessages((prev) => [...prev, userMessage]);
        }
        setIsRenderUserMessage(true);
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
                    // 別のエージェントの一部の入力値を引き継いだ上で、エージェントを呼び出すための処理
                    inputText: plan.travelBasic ? text + " " + JSON.stringify(plan.travelBasic) : text,
                }

                if (planCreationStatus.inProgressAgent == Agent.NONE) {
                    planCreationStatus.inProgressAgent = Agent.ACTIVITY;
                }

                if (planCreationStatus.inProgressAgent == Agent.HOTEL) {
                    planCreationStatus.hotel = AgentStatus.IN_PROGRESS
                    return (await client.queries.recommendationHotels(request)).data;
                } else if (planCreationStatus.inProgressAgent == Agent.ACTIVITY) {
                    planCreationStatus.activity = AgentStatus.IN_PROGRESS
                    return (await client.queries.recommendationActivities(request)).data
                } else if (planCreationStatus.inProgressAgent == Agent.FLIGHT) {
                    planCreationStatus.flight = AgentStatus.IN_PROGRESS
                    return (await client.queries.recommendationsFlight(request)).data
                } else if (planCreationStatus.inProgressAgent == Agent.USER) {
                    planCreationStatus.user = AgentStatus.IN_PROGRESS
                    return (await client.queries.confirmUserInfo(request)).data
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

        let element: React.JSX.Element;

        if (isJsonParsable(convertedResponse)) {
            const parsedResponse: AgentResponse = JSON.parse(convertedResponse)

            if (parsedResponse.travelBasic) {
                plan.travelBasic = parsedResponse.travelBasic
            }

            if (planCreationStatus.inProgressAgent == Agent.HOTEL && parsedResponse.hotels) {
                setInputAreaStyle(inputAreaStyles.inactive)
                setIsInputAreaDisabled(true)
                element = <HotelElement plan={plan}
                                        hotels={parsedResponse.hotels}
                                        registerPlanToDB={registerPlanToDB}
                                        onHotelRegistered={onHotelRegistered}/>

            } else if (planCreationStatus.inProgressAgent == Agent.ACTIVITY && parsedResponse.activities) {
                setInputAreaStyle(inputAreaStyles.inactive)
                setIsInputAreaDisabled(true)
                element = <ActivityElement plan={plan}
                                           activities={parsedResponse.activities}
                                           registerPlanToDB={registerPlanToDB}
                                           onActivityRegistered={onActivityRegistered}>
                </ActivityElement>

            } else if (planCreationStatus.inProgressAgent == Agent.FLIGHT && parsedResponse.flight) {
                setInputAreaStyle(inputAreaStyles.inactive)
                setIsInputAreaDisabled(true)
                // element = <>{convertedResponse}</>
                element = <FlightElement plan={plan}
                                         flight={parsedResponse.flight}
                                         registerPlanToDB={registerPlanToDB}
                                         onFlightRegistered={onFlightRegistered}/>

            } else {
                element = <>{convertedResponse}</>
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
    const sendMessage = async (input: string, isRender: boolean) => {
        if (!input.trim() || isSending) return;
        setIsSending(true);
        renderUserMessage(input, isRender);

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
