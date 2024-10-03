import React, { useState } from "react";
import { Box, Button, FormControl, Grid, Typography } from "@mui/material";
import { Plan } from "../section/MainContent.tsx";

export interface Hotel {
    name: string;
    description: string;
    image: string;
    price: number;
    address: string; // 住所も表示する
}

interface Props {
    plan: Plan;
    hotels: Hotel[];
    registerPlanToDB: (plan: Plan) => void;
    onHotelRegistered: (plan: Plan) => void;
    onPriceLowerRequest?: () => void; // オプショナルにする
}

export function HotelElement({ plan, hotels, registerPlanToDB, onHotelRegistered, onPriceLowerRequest }: Props): React.JSX.Element {
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

    // 背景色を一色で統一（薄めの青色）
    const backgroundColor = "#e0f7fa";

    const handleHotelClick = (hotel: Hotel) => {
        setSelectedHotel(hotel);
    };

    /**
     * ホテル登録イベント
     */
    const registerHotel = () => {
        if (selectedHotel) {
            plan.hotel = selectedHotel;

            // ホテル情報をJSONでフォーマット
            const hotelResponse = {
                hotels: hotels.map(hotel => ({
                    name: hotel.name,
                    description: hotel.description,
                    price: hotel.price,
                    image: hotel.image
                }))
            };

            console.log("JSON Response:", JSON.stringify(hotelResponse, null, 2)); // 最終的にJSON形式で返す
            registerPlanToDB(plan);
            onHotelRegistered(plan);
        }
    };

    return (
        <FormControl component="fieldset">
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                要望にあったホテルを3つ選んだよ✈
            </Typography>

            {/* xs: スマホでは1列、sm: タブレットでは2列、md: PCでは3列で表示 */}
            <Grid container spacing={2} justifyContent="center">
                {hotels.map((hotel) => (
                    <Grid item xs={12} sm={6} md={4} key={hotel.name} sx={{ position: 'relative' }}>
                        <Box
                            borderRadius={2}
                            p={3} // 上部に余白を少し追加して、「～選択～」と重ならないように
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            border={selectedHotel?.name === hotel.name ? 4 : 2} // 選択されたら枠が太くなる（例: 4px、未選択時は2px）
                            borderColor={selectedHotel?.name === hotel.name ? "#1565C0" : "#1E6374"} // 選択時は深い青（#1565C0）、未選択時は既存の色
                            bgcolor={backgroundColor} // 背景色を統一
                            color="#000" // テキスト色を黒に
                            position="relative"
                            onClick={() => handleHotelClick(hotel)} // ホテルがクリックされたときのイベント
                            sx={{ cursor: 'pointer', height: '100%' }} // カード全体をクリック可能にする
                        >
                            <Box 
                                component="img" 
                                src={hotel.image} 
                                alt={hotel.name} 
                                sx={{ width: "100%", height: "200px", objectFit: "cover", mb: 2 }} 
                            />
                            <Typography variant="h6" align="center" sx={{ minHeight: "3rem" }}>{hotel.name}</Typography>
                            <Typography>{hotel.description}</Typography>
                            <Typography>{hotel.address}</Typography>
                            <Typography>価格: {hotel.price}円</Typography>

                            <Button 
                                variant="contained"
                                sx={{ mt: 2, backgroundColor: 'orange', '&:hover': { backgroundColor: 'darkorange' } }} // 背景色をオレンジに変更し、ホバー時の色を暗いオレンジに
                                href={hotel.image}
                                target="_blank"
                            >
                                詳細はこちら
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Box mt={2}>
                <Button variant="contained" color="primary" sx={{ mx: 1 }} onClick={registerHotel}>
                    こちらのホテルにします✈
                </Button>
                <Button variant="contained" color="secondary" sx={{ mx: 1 }} onClick={onPriceLowerRequest}>
                    価格を下げたい
                </Button>
            </Box>
        </FormControl>
    );
}
