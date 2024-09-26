import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


export function ChatIntroMessage(): React.JSX.Element {
    return (
        <Box sx={{ fontSize: '0.9rem' }}>
            <Box>ご利用いただきありがとうございます！</Box>
            <Box>ひとったび！AIガイドです。あなたのご旅行をもっと特別なものにするために、最適なプランをご提案させていただきます。</Box>
            <Box mt={1}>
                <Typography variant="body1" sx={{fontSize: '0.9rem', fontWeight: 'bold'}}>
                    あなたのご要望を自由に入力してください
                </Typography>
                <Box mt={1}>例えば：</Box>
                <Box>
                    <Box>「明日から一週間、大人2名子供1名で沖縄の海を楽しみたい」</Box>
                    <Box>「5月1日から5日まで、家族4人で泊まれる京都の旅館を教えて」</Box>
                </Box>
            </Box>
            <Box mt={1}>
                <Typography variant="body1" sx={{fontSize: '0.9rem', fontWeight: 'bold'}}>
                    AIと対話しながら決めていくこともできます
                </Typography>
                <Box mt={1}>例えば：</Box>
                <Box
                    component="img"
                    src="/demo1_sp.png"
                    alt="demo1"
                    sx={{width: '100%', maxWidth: 400, borderRadius: 2}}
                />
            </Box>
            <Box mt={1}>
                <Typography variant="body1" sx={{fontSize: '0.9rem', fontWeight: 'bold'}}>
                    必要な情報が揃った段階で最適なアクティビティやホテルを提案いたします
                </Typography>
                <Box
                    component="img"
                    src="/demo2.png"
                    alt="demo2"
                    sx={{ width: '100%', maxWidth: 400, borderRadius: 2 }}
                />
            </Box>
        </Box>
    )
}
