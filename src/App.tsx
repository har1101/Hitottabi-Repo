import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import { Header } from './components/section/Header.tsx';
import { MainContent } from './components/section/MainContent.tsx';

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

const boxStyle = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
}

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box sx={boxStyle}>
                <Header/>
                <MainContent/>
            </Box>
        </ThemeProvider>
    )
}
