import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';

interface MessageProps {
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export function Message({ text, sender, timestamp }: MessageProps) {
  const isUser = sender === 'user';
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          maxWidth: '70%',
          backgroundColor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          borderRadius: isUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {isUser ? <PersonIcon sx={{ mr: 1 }} /> : <AirplanemodeActiveIcon sx={{ mr: 1 }} />}
          <Typography variant="body1">{text}</Typography>
        </Box>
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
          {new Date(timestamp).toLocaleTimeString()}
        </Typography>
      </Paper>
    </Box>
  );
}