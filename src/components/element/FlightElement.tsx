import React, { useState } from "react";
import { styled } from "@mui/material/styles"
import { Box, Container, Grid, Paper, Divider, Button } from "@mui/material";
import { generateClient } from "@aws-amplify/api";
import type { Schema } from "../../../amplify/data/resource"

const client = generateClient<Schema>();

export interface Flight {
    departure: {
        flight_number: string,
        airport: string
        seats: { seat: string, seat_class: string }[]
        departure_time: string
        arrival_time: string
        price: string
    },
    return: {
        flight_number: string,
        airport: string
        seats: { seat: string, seat_class: string }[]
        departure_time: string
        arrival_time: string
        price: string
    }
}

interface Props {
    flights: Flight;
    onFlightRegistered: () => void
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#E0FFFF',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius:0,
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#E0FFFF',
    }),
}));

export function FlightElement({flights, onFlightRegistered}: Props): React.JSX.Element {
    const [isRegistered, setIsRegistered] = useState<boolean>(false)
    const registerFlight = () => {
        const sessionId = sessionStorage.getItem('sessionId')
        if (!sessionId) {
            console.log('The session ID is invalid.')
            return;
        }
        client.models.Plan.update({
            PK: sessionId,
            SK: 'Metadata',
            Flight: {
                departure: {
                    flight_number: flights.departure.flight_number,
                    departure_airport: flights.departure.airport,
                    departure_time: flights.departure.departure_time,
                    arrival_time: flights.departure.arrival_time,
                    price: flights.departure.price,
                    seats: flights.departure.seats.map(item => item.seat)
                },
                return: {
                    flight_number: flights.departure.flight_number,
                    departure_airport: flights.departure.airport,
                    departure_time: flights.departure.departure_time,
                    arrival_time: flights.departure.arrival_time,
                    price: flights.departure.price,
                    seats: flights.departure.seats.map(item => item.seat)
                }
            }
        })
        setIsRegistered(true)
        onFlightRegistered()
    }

    return (
        <Container>
            <Box sx={{padding:1}}>往路便</Box>
            <Box id="departure-flight"
                sx={{
                    flexFlow: 1,
                    bgcolor: "",
                    borderRadius: 3,
                    paddingTop:0
                }}
            >
                <Grid container rowSpacing={0} columnSpacing={0}>
                    <Grid item xs={4}>
                        <Item>便名</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>{flights.departure.flight_number}</Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>出発</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>{flights.departure.airport}</Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>時間</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>{flights.departure.departure_time}-{flights.departure.arrival_time}</Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>座席</Item>
                    </Grid>
                        <Grid item xs={8}>
                            <Item>
                                {flights.departure.seats.map(seat => (
                                    <Box key={seat.seat}>{seat.seat}：{seat.seat_class}</Box>
                                ))}
                            </Item>
                        </Grid>
                    <Grid item xs={4}>
                        <Item>料金</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>{flights.departure.price}円</Item>
                    </Grid>
                </Grid>
            </Box>
            <Divider sx={{padding:1}}/>
            <Box sx={{padding:1}}>復路便</Box>
            <Box id="return-flight"
                sx={{
                    flexFlow: 1,
                    borderRadius: 3,
                }}
            >
                <Grid container rowSpacing={0} columnSpacing={0}>
                    <Grid item xs={4}>
                        <Item>便名</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>{flights.return.flight_number}</Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>出発</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>{flights.return.airport}</Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>時間</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>{flights.return.departure_time}-{flights.return.arrival_time}</Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>座席</Item>
                    </Grid>
                    <Grid item xs={8}>
                            <Item>
                                {flights.return.seats.map(seat => (
                                    <Box key={seat.seat}>{seat.seat}：{seat.seat_class}</Box>
                                ))}
                            </Item>
                        </Grid>
                    <Grid item xs={4}>
                        <Item>料金</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>{flights.return.price}円</Item>
                    </Grid>
                </Grid>
            </Box>
            <Box mt={2}>
                <Button disabled={isRegistered} variant="contained" color="primary" sx={{mx: 1}} onClick={registerFlight}>
                    OK
                </Button>
                <Button disabled={isRegistered} variant="contained" color="secondary" sx={{mx: 1}}>
                    価格を下げたい
                </Button>
            </Box>
        </Container>
    )
}
