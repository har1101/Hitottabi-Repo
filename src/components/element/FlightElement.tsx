import React, { useState } from "react";
import { Box, Paper, TableContainer, Table, TableBody, TableRow, TableCell, Button, Grid, Typography } from "@mui/material";
import { Plan } from "../section/MainContent.tsx";

export interface Flight {
    outbound: {
        airport: string;
        number: string;
        startTime: string;
        endTime: string;
        seats: Seat[];
    };
    inbound: {
        airport: string;
        number: string;
        startTime: string;
        endTime: string;
        seats: Seat[];
    };
}

interface Seat {
    number: string;
    class: string;
}

interface Props {
    plan: Plan;
    flight: Flight;
    registerPlanToDB: (plan: Plan) => void;
    onFlightRegistered: (plan: Plan) => void;
}

export function FlightElement({ plan, flight, registerPlanToDB, onFlightRegistered }: Props): React.JSX.Element {
    const [selectedFlight, setSelectedFlight] = useState<'outbound' | 'inbound' | null>(null);

    // フライト登録を行う関数を定義
    const registerFlight = () => {
        plan.flight = flight; // 現在のフライト情報をプランに設定
        registerPlanToDB(plan); // プランをデータベースに登録
        onFlightRegistered(plan); // 登録完了後の処理を呼び出し
    };

    const handleFlightClick = (flightType: 'outbound' | 'inbound') => {
        setSelectedFlight(flightType);
    };

    const backgroundColor = "#e0f7fa";  // 背景色を統一

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                条件に合う往路、帰路が見つかりました。
            </Typography>

            {/* 出発日と帰着日を横並びで表示 */}
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>出発日: {plan.travelBasic?.outbound.date}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>帰着日: {plan.travelBasic?.inbound.date}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} justifyContent="center">
                {/* 往路 */}
                <Grid item xs={12} sm={5} sx={{ position: 'relative' }}>
                    <Box
                        borderRadius={2}
                        p={3}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        border={selectedFlight === 'outbound' ? 4 : 2} // 選択されたら枠が太くなる
                        borderColor={selectedFlight === 'outbound' ? "#1565C0" : "#1E6374"} // 選択時は青、未選択時は既存色
                        bgcolor={backgroundColor}
                        sx={{ cursor: 'pointer', height: '100%' }}
                        onClick={() => handleFlightClick('outbound')}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>往路</Typography>
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
                                            {flight.outbound.seats.map((seat, index) => (
                                                <Box key={index} display="flex" justifyContent="space-between">
                                                    <Typography>{seat.number}</Typography>
                                                    <Typography>{seat.class}</Typography>
                                                </Box>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>

                {/* 帰路 */}
                <Grid item xs={12} sm={5} sx={{ position: 'relative' }}>
                    <Box
                        borderRadius={2}
                        p={3}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        border={selectedFlight === 'inbound' ? 4 : 2} // 選択されたら枠が太くなる
                        borderColor={selectedFlight === 'inbound' ? "#1565C0" : "#1E6374"} // 選択時は青、未選択時は既存色
                        bgcolor={backgroundColor}
                        sx={{ cursor: 'pointer', height: '100%' }}
                        onClick={() => handleFlightClick('inbound')}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>帰路</Typography>
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
                                            {flight.inbound.seats.map((seat, index) => (
                                                <Box key={index} display="flex" justifyContent="space-between">
                                                    <Typography>{seat.number}</Typography>
                                                    <Typography>{seat.class}</Typography>
                                                </Box>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
            </Grid>

            {/* ボタンエリア */}
            <Box mt={4} textAlign="center">
                <Button variant="contained" color="primary" sx={{ px: 4, py: 1.5 }} onClick={registerFlight}>
                    OK
                </Button>
                <Button variant="contained" color="secondary" sx={{ mx: 1 }}>
                    価格を下げたい
                </Button>
            </Box>
        </Box>
    );
}
