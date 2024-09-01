import React, { useState } from "react";
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Hotel } from "../section/MainContent.tsx";

interface Props {
    hotels: Hotel[]
    changeSelectedHotel: (value: string) => void;
}

export function HotelElement({hotels, changeSelectedHotel}: Props): React.JSX.Element {
    const [selected, setSelected] = useState<Hotel | null>(null);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hotel = hotels.find(hotel => hotel.name === event.target.value) || null;
        changeSelectedHotel(event.target.value)
        setSelected(hotel)
    }

    return (
        <FormControl component="fieldset">
            <FormLabel id="radio-group-hotels">
                あなたにおすすめのホテルはこちらです。
            </FormLabel>
            <RadioGroup
                aria-labelledby="radio-group-hotels"
                name="hotels"
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
            {selected && (
                <Box mt={2}>
                    <FormLabel id="radio-group-selected-hotels">
                        あなたが選んだホテル
                    </FormLabel>
                    <Box mt={2}>{selected.name}</Box>
                    <Box>{selected.description}</Box>
                </Box>
            )}
        </FormControl>
    )
}
