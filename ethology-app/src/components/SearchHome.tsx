import { Button, FormControl, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchField from "./atoms/SearchField";
import logo from "../assets/ethology-logo.png";

const SearchHome = () => {
  const [value, setValue] = useState("");

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        width: "100vw",
        paddingLeft: "15vw",
        alignContent: "flex-start",
      }}
    >
      <Grid container sx={{ marginTop: "0vh", marginLeft: "15vw" }}>
        <Grid item>
          <img
            src={logo}
            alt="logo"
            style={{ height: "35rem", width: "35rem" }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={1}
        direction="row"
        alignItems="center"
        sx={{ mb: "10vh" , mt: "-10vh"}}
      >
        <Grid item xs={6}>
          <FormControl fullWidth>
            <SearchField value={value} handleChange={handleChange} />
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <Link
            to={{ pathname: "/search", search: "q=" + value }}
            style={{ textDecoration: "none" }}
          >
            <Button variant="contained">Search</Button>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchHome;
