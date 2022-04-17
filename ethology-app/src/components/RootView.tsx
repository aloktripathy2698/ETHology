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
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { IFilterState, IRootView } from "../interfaces/interface";
import FilterMenu from "./atoms/FilterMenu";
import { FilterContext } from "../contexts/FilterContext";
import { FILTER_OPTIONS } from "../constants";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import { APP_NAME, LABEL_DASHBOARD } from "./constants";
import { useState } from "react";

const RootView = (props: IRootView) => {
  const hideFilter = props.hideFilter;
  const [open, setOpen] = useState(false);
  const [filterState, setFilterState] = useState<IFilterState>({
    poi: FILTER_OPTIONS.poi,
    lang: FILTER_OPTIONS.lang,
    country: FILTER_OPTIONS.country,
  });
  const navigate = useNavigate();
  const { search } = useLocation();

  const { enqueueSnackbar } = useSnackbar();

  const handleAccountChange = async (accounts: string[]) => {
    console.log("Metamask account changed! ", accounts[0]);
    enqueueSnackbar(`Welcome ${accounts[0]}`, {
      variant: "success", // one of: 'error', 'warning', 'info', 'success'
      autoHideDuration: 3000, // ms
    });
  };
  (window as any).ethereum.on("accountsChanged", handleAccountChange);

  const handleFilterChange = (
    filterName: string,
    name: string,
    checked: boolean
  ) => {
    // const newFilterState: IFilterState = { ...filterState };
    // newFilterState[filterName] = newFilterState[filterName].map(
    //   (filter: { name: string; value: string; checked: boolean }) => {
    //     if (filter.name === name) {
    //       filter.checked = checked;
    //     }
    //     return filter;
    //   }
    // );
    // setFilterState(newFilterState);

    // TODO: use navigate to update url
    const searchParams = new URLSearchParams(search);
    const query = searchParams.get("q");
    // const filterString = getFilterString(newFilterState);
    // navigate(`/search?q=${query}&${filterString}`);
  };

  const filterClickHandler = () => {
    setOpen(!open);
  };

  const onDrawerClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   // fetch the top POIs
  //   const fetchTopPOIs = async () => {
  //     const response = await getTopNPois(30);
  //     setFilterState({ ...filterState, poi: createPOIArr(response) });
  //   };
  //   fetchTopPOIs();
  // }, []);

  return (
    <FilterContext.Provider value={filterState}>
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
                  <Tooltip title="View charts and visualizations">
                    <Link
                      to="/dashboard"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      {LABEL_DASHBOARD}
                    </Link>
                  </Tooltip>
                </Typography>
              </Button>
              <Button
                variant="text"
                aria-label="menu"
                sx={{
                  color: "white",
                  display: hideFilter ? "none" : "inherit",
                }}
                onClick={filterClickHandler}
              >
                <FilterAltRoundedIcon />
                <Tooltip title="Filter search results">
                  <Typography variant="h6">Filters</Typography>
                </Tooltip>
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
            <Grid container direction="column">
              <Grid item xs={12}>
                <FilterMenu
                  title="POIs"
                  filterName="poi"
                  handleFilterChange={handleFilterChange}
                  options={filterState.poi}
                />
                <FilterMenu
                  title="Country"
                  filterName="country"
                  handleFilterChange={handleFilterChange}
                  options={filterState.country}
                />
                <FilterMenu
                  title="Language"
                  filterName="lang"
                  handleFilterChange={handleFilterChange}
                  options={filterState.lang}
                />
              </Grid>
            </Grid>
          </Drawer>
        </Box>
        {props.root}
      </Box>
    </FilterContext.Provider>
  );
};

export default RootView;
