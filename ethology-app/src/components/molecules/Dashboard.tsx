// This is the file for the dashboard for both the admin and the user
import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IDashboardProps } from "../../interfaces/interface";
import GenericCard from "../atoms/GenericCard";
import ProgressStepper from "../atoms/ProgressStepper";
import NoResults from "../atoms/NoResults";
import SearchResultSkeleton from "../SearchResultSkeleton";
import { getCurrentAccount, isOwnerLoggedIn } from "../../utils";
import { contract } from "../../blockchain/load-contract-config";
import { BUYER_PHASE_MAPPING, SUPPLIER_PHASE_MAPPING } from "../constants";
import { useSnackbar } from "notistack";

// This component to contain list of material ui stepper components

const Dashboard = (props: IDashboardProps) => {
  const [poList, setPOList] = useState<Array<Record<string, string>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [balance, setBalance] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const fetchOwnerInfo = async () => {
    const ownerInfo = await isOwnerLoggedIn();
    console.log("isOwnerLoggedIn", ownerInfo);
    setIsOwner(ownerInfo);
    setIsLoading(false);
  };

  const getPOList = async () => {
    // check the poList
    try {
      setIsLoading(true);
      const isOwner = await isOwnerLoggedIn();
      setIsOwner(isOwner);
      const list = await contract.methods.getPOList().call();
      console.log("getPOList: ", list);
      const currentAccount = await getCurrentAccount();
      console.log("[getPOList] currentAccount: ", currentAccount);
      if (isOwner) {
        setPOList(list);
        fetchBalance();
      } else {
        const filteredList = list.filter((item: Record<string, string>) => {
          return item.buyer.toLowerCase() === currentAccount.toLowerCase();
        });
        console.log("filteredList: ", filteredList);
        setPOList(filteredList);
      }
    } catch (error) {
      setIsLoading(false);
      const errorStr = (error as any).message;
      const message = errorStr.substr(errorStr.lastIndexOf(":") + 1).trim();
      console.log("Error: ", message);
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  const fetchBalance = async () => {
    try {
      const balance = await contract.methods.getBalance().call();
      console.log("[fetchBalance] balance: ", balance);
      setBalance(balance);
    } catch (error) {
      const errorStr = (error as any).message;
      const message = errorStr.substr(errorStr.lastIndexOf(":") + 1).trim();
      console.log("Error: ", message);
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  // fetch the local data
  useEffect(() => {
    setIsLoading(true);
    fetchOwnerInfo();
    getPOList();
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
      {isOwner && (
        <Typography variant="h6" component="h6" sx={{ fontWeight: "bold" }}>
          Balance: {balance}
        </Typography>
      )}
      {isLoading ? (
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <Grid item key={i} xs={12} sx={{ width: "100%" }}>
            <SearchResultSkeleton />
          </Grid>
        ))
      ) : poList.length > 0 ? (
        poList.map((searchResult: Record<string, string>) => (
          <Grid item key={searchResult.id} xs={12} sx={{ width: "100%" }}>
            {
              <GenericCard>
                <Grid container direction="column" padding={2} spacing={4}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h1"
                      sx={{ fontWeight: "bold", fontSize: 21, opacity: 0.5 }}
                    >
                      Basic Info
                    </Typography>
                    <Grid container direction="row" spacing={2}>
                      <Grid item>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color="#616161"
                        >
                          Buyer Address:{" "}
                        </Typography>
                        <Typography variant="caption">
                          {searchResult.buyer || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color="#616161"
                        >
                          Product ID:{" "}
                        </Typography>
                        <Typography variant="caption">
                          {searchResult.id || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color="#616161"
                        >
                          Price:{" "}
                        </Typography>
                        <Typography variant="caption">
                          {searchResult.price || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color="#616161"
                        >
                          Supplier Phase:{" "}
                        </Typography>
                        <Typography variant="caption">
                          {SUPPLIER_PHASE_MAPPING[
                            searchResult.supplierStatus
                          ] || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color="#616161"
                        >
                          Buyer Phase:{" "}
                        </Typography>
                        <Typography variant="caption">
                          {BUYER_PHASE_MAPPING[searchResult.buyerStatus] ||
                            "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: "bold",
                        fontSize: 21,
                        opacity: 0.5,
                        mb: 1.5,
                      }}
                    >
                      Update Phases
                    </Typography>
                    <ProgressStepper
                      steps={["Approval", "Procurement", "Delivery"]}
                      isOwner={isOwner}
                      id={searchResult.id}
                      price={searchResult.price}
                      account={searchResult.buyer}
                      buyerStatus={searchResult.buyerStatus}
                      supplierStatus={searchResult.supplierStatus}
                    />
                  </Grid>
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
