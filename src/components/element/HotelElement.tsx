import React, { useState } from "react";
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

export interface Hotel {
    name: string,
    description: string
}

interface Props {
    hotels: Hotel[];
    changeSelectedHotel: (hotel: Hotel) => void;
    registerHotel: (hotel: Hotel) => void;

}

export function HotelElement({hotels, changeSelectedHotel, registerHotel}: Props): React.JSX.Element {
    const [selected, setSelected] =
        useState<Hotel>(hotels[0]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hotel = hotels.find(hotel => hotel.name === event.target.value) || null;

        if (hotel) {
            changeSelectedHotel(hotel)
            setSelected(hotel)
        }
    }

    const onClick = () => registerHotel(selected)


    return (
        <FormControl component="fieldset">
            <FormLabel id="radio-group-hotels">
                あなたにおすすめのホテルはこちらです。
            </FormLabel>
            <RadioGroup
                aria-labelledby="radio-group-hotels"
                name="hotels"
                // defaultValue={selected?.name || ""}
                onChange={onChange}
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
            <Box mt={2}>
                <Button variant="contained" color="primary" sx={{ mx: 1 }} onClick={onClick}>
                    OK
                </Button>
                <Button variant="contained" color="secondary" sx={{ mx: 1 }}>
                    価格を下げたい
                </Button>
            </Box>
        </FormControl>
    )
}
