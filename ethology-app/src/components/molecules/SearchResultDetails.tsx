import { Grid } from "@mui/material";
import SearchResultInfo from "../atoms/SearchResultInfo";

const SearchResultDetails = () => {
  return (
    <Grid container padding={3} spacing={3}>
      <Grid item xs={12}>
        <SearchResultInfo />
      </Grid>
    </Grid>
  );
};

export default SearchResultDetails;
