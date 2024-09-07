import React from "react";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FlightIcon from '@mui/icons-material/Flight';

export function Header(): React.JSX.Element {
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
        </Toolbar>
    </AppBar>
  );
}
