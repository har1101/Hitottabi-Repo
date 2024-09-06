import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

interface Props {
    input: string;
    setInput: (input: string) => void;
    sendMessage: () => void;
    inputAreaStyle: object
    isInputAreaDisabled: boolean
}

const outerBoxStyles = {
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    padding: 2,
    backgroundColor: 'background.paper',
    borderTop: '1px solid',
    borderColor: 'divider'
};

const innerBoxStyles = {
    display: 'flex',
    maxWidth: '1200px',
    margin: '0 auto',
    alignItems: 'center',
    padding: 2
};

export function ChatInputArea({input, setInput, sendMessage, inputAreaStyle, isInputAreaDisabled}: Props) {

    /**
     * Shift + Enterキーを押下した時にメッセージが送信される
     * @param e
     */
    const handleKeyPress = (e: React.KeyboardEvent): void => {
        if (e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <Box sx={outerBoxStyles}>
            <Box sx={innerBoxStyles}>
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    variant="outlined"
                    placeholder="Ask about your travel..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    sx={inputAreaStyle}
                    disabled={isInputAreaDisabled}
                />
                <IconButton color="primary" onClick={sendMessage} sx={{ml: 1}}>
                    <SendIcon/>
                </IconButton>
            </Box>
        </Box>
    );
}
