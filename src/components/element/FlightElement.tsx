import {
    Box,
    Paper,
    TableContainer,
    Table,
    TableBody,
    TableRow, TableCell, Button
} from "@mui/material";
import { Plan } from "../section/MainContent.tsx";




export interface Flight {
    outbound: {
        airport: string
        number: string
        startTime: string
        endTime: string
        seats: Seat[]
    },
    inbound: {
        airport: string
        number: string
        startTime: string
        endTime: string
        seats: Seat[]
    }
}

interface Seat {
    number: string
    class: string
}

interface Props {
    plan: Plan;
    flight: Flight;
    registerPlanToDB: (plan: Plan) => void
    onFlightRegistered: (plan: Plan) => void
}

export function FlightElement({plan, flight, registerPlanToDB, onFlightRegistered}: Props): React.JSX.Element {

    /**
     * ホテル登録イベント
     */
    const registerFlight = () => {
        plan.flight = flight

        registerPlanToDB(plan)

        // コールバック関数
        onFlightRegistered(plan)
    }

    return (
        <Box>
            <Box>条件に合う往路、帰路が見つかりました。</Box>
            <Box display="flex">
                <Box mt={2}>
                    <Box>往路</Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>空港</TableCell>
                                    <TableCell>{flight.outbound.airport}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>便</TableCell>
                                    <TableCell>{flight.outbound.number}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>出発時間</TableCell>
                                    <TableCell>{flight.outbound.startTime}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>到着時間</TableCell>
                                    <TableCell>{flight.outbound.endTime}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>席</TableCell>
                                    <TableCell>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableBody>
                                                    {
                                                        flight.outbound.seats.map((seat, index) => (
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
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>空港</TableCell>
                                    <TableCell>{flight.inbound.airport}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>便</TableCell>
                                    <TableCell>{flight.inbound.number}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>出発時間</TableCell>
                                    <TableCell>{flight.inbound.startTime}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>到着時間</TableCell>
                                    <TableCell>{flight.inbound.endTime}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>席</TableCell>
                                    <TableCell>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableBody>
                                                    {
                                                        flight.inbound.seats.map((seat, index) => (
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
            <Box mt={2}>
                <Button variant="contained" color="primary" sx={{mx: 1}} onClick={registerFlight}>
                    OK
                </Button>
            </Box>
        </Box>
    )
}
