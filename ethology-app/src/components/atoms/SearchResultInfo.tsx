import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { contract, web3Instance } from "../../blockchain/load-contract-config";
import { getLocalDbData } from "../../services/search";
import { getCurrentAccount } from "../../utils";
import { PRODUCT_DETAILS_LABEL } from "../constants";
import SearchResultSkeleton from "../SearchResultSkeleton";
import NoResults from "./NoResults";
import SearchResult from "./SearchResult";
const getRevertReason = require("eth-revert-reason");

const SearchResultInfo = () => {
  const [params] = useSearchParams();
  const poiName = (params.get("poi") as string) ?? "";
  const productId: number = Number(params.get("id") as string) ?? -1;
  const price: number = Number(params.get("price") as string) ?? -1;
  const [data, setData] = React.useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = React.useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

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
    setButtonLoading(true);
    const currentAccount = await getCurrentAccount();
    console.log("Current Account: ", currentAccount);
    // const ownerAccount = await getOwnerAccount();
    try {
      // let isAlreadyRaised = await contract.methods.isPoAlreadyRaised(productId).call();
      // console.log("isPoAlreadyRaised: ", isAlreadyRaised);
      // const txn = await contract.methods.raisePo(productId, price);
      // console.log('revert reason: ', await getRevertReason('0xe2bbabca586694de6aad496db534e5a6aeb2a16360c227d2f6b4774ee4e2f374'))
      // console.log("gas: ", await txn.estimateGas({ from: currentAccount }));

      // const txnOptions = {
      //   from: currentAccount,
      //   data: txn.encodeABI(),
      //   gas: 5000000,
      // };

      // console.log("txnOptions: ", txnOptions);

      // const signedTxn = await web3Instance.eth.accounts.signTransaction(
      //   txnOptions,
      //   process.env.REACT_APP_PRIVATE_KEY3 || ""
      // );

      // console.log("signedTxn: ", signedTxn);

      // const status = await web3Instance.eth.sendSignedTransaction(
      //   signedTxn.rawTransaction as string
      // );

      // const status = await web3Instance.eth.sendTransaction(txnOptions);

      const status = await contract.methods.raisePo(productId, price).send({
        from: currentAccount,
        gas: 5000000,
      });

      console.log("RaisePO Status: ", status);
      enqueueSnackbar("Purchase Order Raised Successfully", {
        variant: "success",
      });
      setButtonLoading(false);
    } catch (error) {
      const errorStr = (error as any).message;
      const message = errorStr.substr(errorStr.lastIndexOf(":") + 1).trim();
      console.log("Error: ", message);
      enqueueSnackbar(message, { variant: "error" });
      setButtonLoading(false);
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
                      disabled={buttonLoading}
                    >
                      {buttonLoading ? (
                        <CircularProgress sx={{ height: 10 }} />
                      ) : (
                        <Typography>Send Purchase Order Request</Typography>
                      )}
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
