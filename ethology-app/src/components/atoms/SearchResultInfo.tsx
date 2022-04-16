import { Co2Sharp } from "@mui/icons-material";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { contract } from "../../blockchain/load-contract-config";
import { ISearchResultDetails } from "../../interfaces/interface";
import {
  getLocalDbData,
  getSearchResults,
  getTweetByID,
} from "../../services/search";
import { getCurrentAccount } from "../../utils";
import { PRODUCT_DETAILS_LABEL } from "../constants";
import SearchResultSkeleton from "../SearchResultSkeleton";
import NoResults from "./NoResults";
import SearchResult from "./SearchResult";

const SearchResultInfo = () => {
  const [params] = useSearchParams();
  const poiName = (params.get("poi") as string) ?? "";
  const productId: number = Number(params.get("id") as string) ?? -1;
  const price: number = Number(params.get("price") as string) ?? -1;
  const [data, setData] = React.useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  // const fetchData = async () => {
  //   const response = await getTweetByID(productId || "");
  //   if (response.length > 0) {
  //     setData(response);
  //   } else {
  //     setData([]);
  //   }
  //   setLoading(false);
  // };

  const fetchData = async () => {
    // get data from the local db
    const localData = await getLocalDbData();
    console.log("Local Data: ", localData);
    console.log(typeof localData[0].id);
    console.log(
      "Data being saved: ",
      localData.filter((item: Record<string, any>) => item.id === productId)
    );
    setData(
      localData.filter((item: Record<string, any>) => item.id === productId)
    );
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [params, productId, poiName]);

  const handlePORequest = async () => {
    const currentAccount = getCurrentAccount();
    console.log("Current Account: ", currentAccount);
    try {
      const status = await contract.methods
        .raisePO(productId, price)
        .send({ from: currentAccount, gas: "1000000" });
      console.log("RaisePO Status: ", status);
      enqueueSnackbar("Purchase Order Raised Successfully", {
        variant: "success",
      });
    } catch (error) {
      const errorStr = (error as any).message;
      const message = errorStr.substr(errorStr.lastIndexOf(":") + 1).trim();
      console.log("Error: ", message);
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={2} direction="column">
        <Grid item xs={12}>
          <Typography
            variant="h5"
            fontSize={30}
            sx={{ fontWeight: "bold", opacity: 0.5 }}
          >
            {PRODUCT_DETAILS_LABEL}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            ["Result"].map((i) => (
              <Grid item key={i} xs={12} sx={{ width: "100%" }}>
                <SearchResultSkeleton />
              </Grid>
            ))
          ) : data.length > 0 ? (
            data.map((searchResult: any) => (
              <Grid item key={searchResult.id} xs={12} sx={{ width: "100%" }}>
                {
                  <Grid container direction="column" padding={2} spacing={2}>
                    <SearchResult
                      annotation={searchResult || "N/A"}
                      subtitle={searchResult.listing_date || "N/A"}
                      title={searchResult.listing_text || "Title not available"}
                    />
                    <Button
                      onClick={handlePORequest}
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                    >
                      Send Purchase Order Request
                    </Button>
                  </Grid>
                }
              </Grid>
            ))
          ) : (
            <NoResults title="Product info not found" />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SearchResultInfo;
