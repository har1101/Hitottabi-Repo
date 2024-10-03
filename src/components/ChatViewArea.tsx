import { useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { ChatMessage, Message } from "./ChatMessage";

export interface Messages {
    messages: Message[]
}

const useWindowWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return width;
};


export function ChatViewArea({messages}: Messages) {
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const width = useWindowWidth();

    // 新しいメッセージが追加されたら、スクロール位置を調整する
    function scrollToBottom() {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <Box
            ref={chatContainerRef}
            sx={{
                width: {width},
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column-reverse',
                overflowY: 'auto',
                gap: 2,
                padding: 2,
                backgroundColor: 'background.default',
                whiteSpace: "pre-wrap"
            }}
        >
            {/* メッセージを逆順に表示 */}
            {messages.slice().reverse().map((message) => (
                <ChatMessage key={message.id} {...message} />
            ))}
        </Box>
    );
}
