import React, { useState } from "react";
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Plan } from "../section/MainContent.tsx";

export interface Hotel {
    name: string,
    description: string
}

interface Props {
    plan: Plan
    hotels: Hotel[];
    registerPlanToDB: (plan: Plan) => void
    onHotelRegistered: (plan: Plan) => void
}

export function HotelElement({plan, hotels, registerPlanToDB, onHotelRegistered}: Props): React.JSX.Element {
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
        plan.hotel = selectedHotel

        registerPlanToDB(plan)

        // コールバック関数
        onHotelRegistered(plan)
    }

    return (
        <FormControl component="fieldset">
            <FormLabel id="radio-group-hotels">
            要望に合ったホテルを選んだよ。
            </FormLabel>
            <RadioGroup
                aria-labelledby="radio-group-hotels"
                name="hotels"
                value={selectedHotel?.name || ""}
                onChange={onChange}
                sx={{ display: "flex", flexDirection: "row" }} // 横並びに設定
            >
                {hotels.map((hotel) => (
                    <FormControlLabel
                        key={hotel.name}
                        value={hotel.name}
                        control={<Radio />}
                        label={
                            <Box ml={2} display="flex" flexDirection="row"> {/* 横並び設定 */}
                                <Box>{hotel.name}</Box>
                                <Box ml={2}>{hotel.description}</Box> {/* 少し間隔を開ける */}
                            </Box>
                        }
                        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 3 }} // 
                    />
                ))}
            </RadioGroup>
            <Box mt={2} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" sx={{mx: 1}} onClick={registerHotel}>
                    OK
                </Button>
                <Button variant="contained" color="secondary" sx={{mx: 1}}>
                    詳細はこちら
                </Button>
            </Box>
        </FormControl>
    )
}
