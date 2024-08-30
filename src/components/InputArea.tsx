import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

interface InputAreaProps {
  input: string;
  setInput: (input: string) => void;
  sendMessage: () => void;
}

export function InputArea({ input, setInput, sendMessage }: InputAreaProps) {
  // Enterキーが押されたときにメッセージを送信する
  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <Box 
      sx={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        padding: 2,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          maxWidth: '1200px',
          margin: '0 auto',
          alignItems: 'center',
          padding: 2
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          variant="outlined"
          placeholder="Ask about your travel..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <IconButton color="primary" onClick={sendMessage} sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}