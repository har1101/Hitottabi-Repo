import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import { Message } from "./section/MainContent.tsx";
import React from "react";

const getPaperStyles = (isUser: boolean) => ({
    p: 2,
    maxWidth: '70%',
    backgroundColor: isUser ? 'primary.main' : 'background.paper',
    color: isUser ? 'primary.contrastText' : 'text.primary',
    borderRadius: isUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
});

const boxStyles = {
    display: 'flex',
    alignItems: 'center',
    mb: 1
}

export function ChatMessage(message: Message): React.JSX.Element {

    const isUser = message.sender === 'user';

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
            }}
        >
            <Paper elevation={2} sx={getPaperStyles(isUser)}>
                <Box sx={boxStyles}>
                    {isUser ? <PersonIcon sx={{mr: 1}}/> : <AirplanemodeActiveIcon sx={{mr: 1}}/>}
                    <Typography variant="body1">
                        {message.text}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}
