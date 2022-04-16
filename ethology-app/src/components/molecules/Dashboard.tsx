// This is the file for the dashboard for both the admin and the user
import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  IDashboardProps,
  ISearchResultResponse,
} from "../../interfaces/interface";
import { SEARCH_ENDPOINT } from "../../services/constants";
import GenericCard from "../atoms/GenericCard";
import ProgressStepper from "../atoms/ProgressStepper";
import NoResults from "../atoms/NoResults";
import SearchResult from "../atoms/SearchResult";
import SearchResultSkeleton from "../SearchResultSkeleton";
import { getCurrentAccount, isOwnerLoggedIn } from "../../utils";
import themeOptions from "../../theme/theme";
import { contract } from "../../blockchain/load-contract-config";

// This component to contain list of material ui stepper components

const Dashboard = (props: IDashboardProps) => {
  // dummy data
  const url = SEARCH_ENDPOINT;
  const [searchResults, setSearchResults] = useState<ISearchResultResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  // const [currentAccount, setCurrentAccount] = useState<string>("");

  const fetchData = async () => {
    const rawData = await fetch(url);
    const data: ISearchResultResponse[] = await rawData.json();
    setSearchResults(data);
  };

  const fetchOwnerInfo = async () => {
    console.log("fetching owner info - param: ", props.currentAccount);
    const ownerInfo = await isOwnerLoggedIn();
    console.log("isOwnerLoggedIn", ownerInfo);
    setIsOwner(ownerInfo);
    setIsLoading(false);
  };

  // fetch the local data
  useEffect(() => {
    setIsLoading(true);
    fetchData();
    fetchOwnerInfo();

    // check the poList
    try {
      contract.methods
        .getPOList(getCurrentAccount())
        .call()
        .then((poList: any) => {
          console.log("PO List: ", poList);
        });
    } catch (e) {
      console.log("Error: ", e);
    }
  }, []);

  return (
    <Grid container direction="column" padding={2} spacing={2} sx={{ mt: 2 }}>
      <Typography
        variant="h5"
        component="h5"
        sx={{ fontWeight: "bold", fontSize: 30, opacity: 0.5 }}
      >
        {isOwner ? "Admin Dashboard" : "User Dashboard"}
      </Typography>
      {isLoading ? (
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <Grid item key={i} xs={12} sx={{ width: "100%" }}>
            <SearchResultSkeleton />
          </Grid>
        ))
      ) : searchResults.length > 0 ? (
        searchResults.map((searchResult: any) => (
          <Grid item key={searchResult.id} xs={12} sx={{ width: "100%" }}>
            {
              <GenericCard>
                <Grid container direction="column" padding={2}>
                  <ProgressStepper
                    steps={["Approval", "Procurement", "Delivery"]}
                  />
                </Grid>
              </GenericCard>
            }
          </Grid>
        ))
      ) : (
        <NoResults title="No result found" />
      )}
    </Grid>
  );
};

export default Dashboard;
