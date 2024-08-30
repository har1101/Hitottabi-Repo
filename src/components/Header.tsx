import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FlightIcon from '@mui/icons-material/Flight';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

interface HeaderProps {
  signOut?: () => void;
}

export function Header({ signOut }: HeaderProps): JSX.Element {
  // return以下の内容が画面に表示される
  return (
    <AppBar 
      position="sticky"
      color="primary"
      elevation={0}
    >
        <Toolbar>
          <FlightIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ひとったび！
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={signOut}
          >
            ログアウト
          </Button>
        </Toolbar>
        
    </AppBar>
  );
};