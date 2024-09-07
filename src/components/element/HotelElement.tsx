import React, { useState } from "react";
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../../amplify/data/resource.ts";


const client = generateClient<Schema>();

export interface Hotel {
    name: string,
    description: string
}

interface Props {
    hotels: Hotel[];
    onHotelRegistered: () => void
}

export function HotelElement({hotels, onHotelRegistered}: Props): React.JSX.Element {
    const [selectedHotel, setSelectedHotel] = useState<Hotel>(hotels[0]);

    /**
     * ラジオボタン選択時イベント
     * @param event
     */
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hotel = hotels.find(hotel => hotel.name === event.target.value) || null;

        if (hotel) {
            setSelectedHotel(hotel)
        }
    }

    /**
     * ホテル登録イベント
     */
    const registerHotel = () => {
        const sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            console.log('The session ID is invalid.')
            return;
        }

        client.models.Plan.create({
            PK: sessionId,
            SK: 'Metadata',
            Hotel: {
                name: selectedHotel.name,
                description: selectedHotel.description
            },
        })

        // コールバック関数
        onHotelRegistered()
    }

    return (
        <FormControl component="fieldset">
            <FormLabel id="radio-group-hotels">
                あなたにおすすめのホテルはこちらです。
            </FormLabel>
            <RadioGroup
                aria-labelledby="radio-group-hotels"
                name="hotels"
                value={selectedHotel?.name || ""}
                onChange={onChange}
            >
                {hotels.map((hotel) => (
                    <FormControlLabel
                        key={hotel.name}
                        value={hotel.name}
                        control={<Radio/>}
                        label={
                            <Box mt={2}>
                                <Box>{hotel.name}</Box>
                                <Box>{hotel.description}</Box>
                            </Box>
                        }
                    />
                ))}
            </RadioGroup>
            <Box mt={2}>
                <Button variant="contained" color="primary" sx={{mx: 1}} onClick={registerHotel}>
                    OK
                </Button>
                <Button variant="contained" color="secondary" sx={{mx: 1}}>
                    価格を下げたい
                </Button>
            </Box>
        </FormControl>
    )
}
