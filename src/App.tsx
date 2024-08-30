import {useState} from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import {ChatArea, Header, InputArea} from './components';
import {v4 as uuidv4} from 'uuid';

import {Amplify} from 'aws-amplify';
import {generateClient} from 'aws-amplify/api';
import {CREATE_ITEM_QUERY} from "./graphQL/Create.tsx";


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

  Amplify.configure({
    API: {
      GraphQL: {
        endpoint: 'https://fbhwadog6zajfogw2ejwb654hm.appsync-api.ap-northeast-1.amazonaws.com/graphql',
        region: 'ap-northeast-1',
        defaultAuthMode: 'apiKey',
        apiKey: 'da2-ycfd2h4mnrdx3gjs7maha4nabm'
      }
    }
  });

  // メッセージを送信する関数
  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: IMessage = {
      id: uuidv4(),
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    };
    setInput(''); // 入力欄をクリア
    setMessages((prev) => [...prev, userMessage]);

    const client = generateClient();
    const callLambda = async () => {
      try {
        return await client.graphql({
          query: CREATE_ITEM_QUERY,
        })

      } catch (error) {
        console.error('Error invoking lambda:', error);
      }
    };

    const res = await callLambda()
    console.log(res)
    const message = JSON.parse(res.data.invokeAgent.body).message

    const botMessage: IMessage = {
      id: uuidv4(),
      text: message,
      sender: 'ai',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, botMessage]);

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