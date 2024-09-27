import React, { useState } from "react";
import { Box, Button, FormControl, Grid, Typography } from "@mui/material";
import { Plan } from "../section/MainContent.tsx";

export interface Activity {
    name: string;
    description: string;
    image: string;
    location: string;
    price: number;
}

interface TravelBasic {
    outbound: {
        location: string;
        date: string;
    };
    inbound: {
        location: string;
        date: string;
    };
    people: {
        adults: number;
        children: number;
        infants: number;
    };
}

interface Props {
    plan: Plan;
    activities: Activity[];
    travelBasic?: TravelBasic; // 旅行基本情報をオプションに変更
    registerPlanToDB: (plan: Plan) => void;
    onActivityRegistered: (plan: Plan) => void;
}

export function ActivityElement({ plan, activities, travelBasic, registerPlanToDB, onActivityRegistered }: Props): React.JSX.Element {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    // 背景色を一色で統一（薄めの青色）
    const backgroundColor = "#e0f7fa";

    const handleActivityClick = (activity: Activity) => {
        setSelectedActivity(activity);
        plan.activity = activity;
        registerPlanToDB(plan);
        onActivityRegistered(plan);
    };

    /**
     * アクティビティ登録イベント
     * 最終的にJSONでアクティビティ情報を返す
     */
    const registerActivity = () => {
        if (selectedActivity) {
            plan.activity = selectedActivity;

            // アクティビティ情報をJSONでフォーマット
            const activityResponse = {
                travelBasic: travelBasic || {}, // travelBasic がない場合の対応
                activities: activities.map(activity => ({
                    name: activity.name,
                    description: activity.description,
                    price: activity.price,
                    image: activity.image
                }))
            };

            console.log("JSON Response:", JSON.stringify(activityResponse, null, 2)); // 最終的にJSON形式で返す
            registerPlanToDB(plan);
            onActivityRegistered(plan);
        }
    };

    return (
        <FormControl component="fieldset">
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                要望にあったアクティビティを3つ選んだよ✈
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                {activities.map((activity) => (
                    <Grid item xs={12} sm={4} key={activity.name} sx={{ position: 'relative' }}>
                        <Box
                            borderRadius={2}
                            p={3} // 上部に余白を少し追加して、「～選択～」と重ならないように
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            border={selectedActivity?.name === activity.name ? 4 : 2} // 選択されたら枠が太くなる（例: 4px、未選択時は2px）
                            borderColor={selectedActivity?.name === activity.name ? "#1565C0" : "#1E6374"} // 選択時は深い青（#1565C0）、未選択時は既存の色
                            bgcolor={backgroundColor} // 背景色を統一
                            color="#000" // テキスト色を黒に
                            position="relative"
                            onClick={() => handleActivityClick(activity)} // アクティビティがクリックされたときのイベント
                            sx={{ cursor: 'pointer', height: '100%' }} // カード全体をクリック可能にする
                        >
                            <Box 
                                component="img" 
                                src={activity.image} 
                                alt={activity.name} 
                                sx={{ width: "100%", height: "200px", objectFit: "cover", mb: 2 }} 
                            />
                            <Typography variant="h6" align="center" sx={{ minHeight: "3rem" }}>{activity.name}</Typography>
                            <Typography>{activity.description}</Typography>
                            <Typography>{activity.location}</Typography>
                            <Typography>価格: {activity.price}円</Typography>

                            <Button 
                                variant="contained" 
                                href={activity.image}
                                target="_blank"
                                sx={{ mt: 2, backgroundColor: 'orange', '&:hover': { backgroundColor: 'darkorange' } }} // 背景色をオレンジに変更し、ホバー時の色を暗いオレンジに
                            >
                                詳細はこちら
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Box mt={2}>
                <Button variant="contained" color="primary" sx={{ mx: 1 }} onClick={registerActivity}>
                    こちらのアクティビティにします✈
                </Button>
                <Button variant="contained" color="secondary" sx={{ mx: 1 }}>
                    価格を下げたい
                </Button>
            </Box>
        </FormControl>
    );
}
