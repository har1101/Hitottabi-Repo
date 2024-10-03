import { Box, Button, Typography, Table, TableContainer, TableBody, TableRow, TableCell } from "@mui/material";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../../amplify/data/resource.ts";
import { Plan } from "../section/MainContent.tsx";
import { useState } from "react";

const client = generateClient<Schema>();

interface AgentRequest {
    sessionId: string,
    inputText: string,
}

interface Props {
    plan: Plan
    onReservationRequested: () => void
}

export function Reservation({plan, onReservationRequested}:Props): React.JSX.Element {

    const [disable, setDisable] = useState(false)
    const sendRequest = async() => {
        const sessionId = sessionStorage.getItem('sessionId')
        if (!sessionId) {
            console.log('The session ID is invalid.')
            return;
        } else {
            const address = "ryota.tasks@gmail.com"
            const request: AgentRequest = {
                sessionId: sessionId,
                inputText: address,
            }
            await client.queries.sendMessage(request)
        }
        setDisable(true)
        onReservationRequested()
    }

    return (
        <Box>
            <Typography variant="body1">以下のプランで予約してよろしいですか？</Typography>
            <Box mt={3}>
                <Box>アクティビティ</Box>
                <Box>{plan.activity?.name}</Box>
                <Box>{plan.activity?.description}</Box>
            </Box>
            <Box mt={3}>
                <Box>宿泊先</Box>
                <Box>{plan.hotel?.name}</Box>
                <Box>{plan.hotel?.description}</Box>
            </Box>
            <Box display="flex">
                <Box mt={2}>
                    <Box>往路</Box>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>空港</TableCell>
                                    <TableCell>{plan.flight?.inbound.airport}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>便</TableCell>
                                    <TableCell>{plan.flight?.inbound.number}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>出発時間</TableCell>
                                    <TableCell>{plan.flight?.inbound.startTime}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>到着時間</TableCell>
                                    <TableCell>{plan.flight?.inbound.endTime}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>席</TableCell>
                                    <TableCell>
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    {
                                                        plan.flight?.inbound.seats.map((seat, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{seat.number}</TableCell>
                                                                <TableCell>{seat.class}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box mt={2} ml={2}>
                    <Box>帰路</Box>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>空港</TableCell>
                                    <TableCell>{plan.flight?.outbound.airport}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>便</TableCell>
                                    <TableCell>{plan.flight?.outbound.number}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>出発時間</TableCell>
                                    <TableCell>{plan.flight?.outbound.startTime}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>到着時間</TableCell>
                                    <TableCell>{plan.flight?.outbound.endTime}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>席</TableCell>
                                    <TableCell>
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    {
                                                        plan.flight?.outbound.seats.map((seat, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{seat.number}</TableCell>
                                                                <TableCell>{seat.class}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            <Button
                variant="contained"
                color="secondary"
                sx={{ mx: 1 }}
                disabled={disable}
                onClick={sendRequest}
            >
                OK
            </Button>
        </Box>
    )
}
