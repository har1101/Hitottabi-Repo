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
    breakpoints: {
        values: {
            xs: 0,   // Extra small devices (phones)
            sm: 600, // Small devices (tablets)
            md: 900, // Medium devices (small laptops)
            lg: 1200,// Large devices (desktops)
            xl: 1536 // Extra large devices (large desktops)
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
