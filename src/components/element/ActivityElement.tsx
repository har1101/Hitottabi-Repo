import React, { useState } from "react";
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Plan } from "../section/MainContent.tsx";

export interface Activity {
    name: string,
    description: string
}

interface Props {
    plan: Plan
    activities: Activity[];
    registerPlanToDB: (plan: Plan) => void
    onActivityRegistered: (plan: Plan) => void
}

export function ActivityElement({plan, activities, registerPlanToDB, onActivityRegistered}: Props): React.JSX.Element {
    const [selectedActivity, setSelectedActivity] = useState<Activity>(activities[0]);

    /**
     * ラジオボタン選択時イベント
     * @param event
     */
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const activity = activities.find(activity => activity.name === event.target.value) || null;

        if (activity) {
            setSelectedActivity(activity)
        }
    }

    /**
     * ホテル登録イベント
     */
    const registerActivity = () => {
        plan.activity = selectedActivity

        registerPlanToDB(plan)

        // コールバック関数
        onActivityRegistered(plan)
    }

    return (
        <FormControl component="fieldset">
            <FormLabel id="radio-group-activities">
                あなたにおすすめのホテルはこちらです。
            </FormLabel>
            <RadioGroup
                aria-labelledby="radio-group-activities"
                name="activities"
                value={selectedActivity?.name || ""}
                onChange={onChange}
            >
                {activities.map((activity) => (
                    <FormControlLabel
                        key={activity.name}
                        value={activity.name}
                        control={<Radio/>}
                        label={
                            <Box mt={2}>
                                <Box>{activity.name}</Box>
                                <Box>{activity.description}</Box>
                            </Box>
                        }
                    />
                ))}
            </RadioGroup>
            <Box mt={2}>
                <Button variant="contained" color="primary" sx={{mx: 1}} onClick={registerActivity}>
                    OK
                </Button>
                <Button variant="contained" color="secondary" sx={{mx: 1}}>
                    価格を下げたい
                </Button>
            </Box>
        </FormControl>
    )
}
