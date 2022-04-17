import {
  AppBar,
  Button,
  Drawer,
  Grid,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { IRootView } from "../interfaces/interface";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import { APP_NAME, LABEL_DASHBOARD } from "./constants";
import { useState } from "react";

const RootView = (props: IRootView) => {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleAccountChange = async (accounts: string[]) => {
    console.log("Metamask account changed! ", accounts[0]);
    enqueueSnackbar(`Welcome ${accounts[0]}`, {
      variant: "success", // one of: 'error', 'warning', 'info', 'success'
      autoHideDuration: 3000, // ms
    });
  };

  (window as any).ethereum.on("accountsChanged", handleAccountChange);

  const onDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box flexGrow={1}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            <Tooltip title="Back to home page">
              <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                {APP_NAME}
              </Link>
            </Tooltip>
          </Typography>
          <Box
            sx={{
              marginLeft: "auto",
              display: "flex",
            }}
          >
            <Button variant="text" aria-label="menu" sx={{ color: "white" }}>
              <BarChartRoundedIcon />
              <Typography variant="h6">
                <Tooltip title="View Purchase Order Status">
                  <Link
                    to="/dashboard"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    {LABEL_DASHBOARD}
                  </Link>
                </Tooltip>
              </Typography>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box role="presentation">
        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              width: "25%",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              paddingTop: "1rem",
            },
          }}
        >
          <Grid container flexDirection="column">
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600}>
                Filters
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              alignContent="right"
              display="flex"
              alignSelf="flex-end"
            >
              <CloseRoundedIcon
                sx={{ cursor: "pointer" }}
                onClick={onDrawerClose}
                fontWeight={600}
              />
            </Grid>
          </Grid>
        </Drawer>
      </Box>
      {props.root}
    </Box>
  );
};

export default RootView;
