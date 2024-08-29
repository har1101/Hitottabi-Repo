import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { Header, ChatArea, InputArea } from './components';
import { v4 as uuidv4 } from 'uuid';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0', // 深い青（飛行機や空をイメージ）
    },
    secondary: {
      main: '#FFA726', // オレンジ（旅行や太陽をイメージ）
    },
    background: {
      default: '#E3F2FD', // 薄い青（雲や空をイメージ）
    },
  },
});

interface IMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export default function App() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState('');

  // メッセージを送信する関数
  function sendMessage() {
    if (!input.trim()) return;

    const userMessage: IMessage = {
      id: uuidv4(),
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput(''); // 入力欄をクリア

    // ボットの応答をシミュレート
    setTimeout(() => {
      const botMessage: IMessage = {
        id: uuidv4(),
        text: `"${input}"についてのメッセージありがとうございます。他に旅行の計画でお手伝いできることはありますか？`,
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
      }}>
        <Header />
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <ChatArea messages={messages} />
          <InputArea input={input} setInput={setInput} sendMessage={sendMessage} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}