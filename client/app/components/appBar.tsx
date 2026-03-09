import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function TopBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ background: "grey" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            System zarządzania biurkami
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
