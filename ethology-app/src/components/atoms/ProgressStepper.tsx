// This is a stepper component which represents the steps in the process of selling and buying

import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { IProgressStepper } from "../../interfaces/interface";
import { useSnackbar } from "notistack";
import { contract, web3Instance } from "../../blockchain/load-contract-config";
import { getCurrentAccount, getOwnerAccount } from "../../utils";
import contractInfo from "../../blockchain/build/contracts/Ethology.json";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const ProgressStepper = (props: IProgressStepper) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [nextDisabled, setNextDisabled] = React.useState(false);
  const [withdrawDisabled, setWithdrawDisabled] = React.useState(false);
  const [freezeDisabled, setFreezeDisabled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const { id, steps, account, buyerStatus, supplierStatus, isOwner, price } =
    props;
  const { enqueueSnackbar } = useSnackbar();

  const handleNext = async () => {
    // check if user status is freeze or not yet
    if (buyerStatus !== "1") {
      enqueueSnackbar("Buyer has not frozen the PO yet", {
        variant: "warning",
      });
      return;
    }

    if (supplierStatus === "2") {
      setNextDisabled(true);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      return;
    } else if (activeStep < 2) {
      // else call the contract and update the status
      try {
        const currentAccount = await getCurrentAccount();
        console.log("[handleNext] currentAccount: ", currentAccount);
        const status = await contract.methods
          .updateSupplierPhase(activeStep + 1 + "", id, account)
          .send({ from: currentAccount, gas: 3000000 });
        console.log("[handleNext] status: ", status);
      } catch (error) {
        const errorStr = (error as any).message;
        const message = errorStr.substr(errorStr.lastIndexOf(":") + 1).trim();
        console.log("Error: ", message);
        enqueueSnackbar(message, { variant: "error" });
      }
    }
    // finally set the next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleFreeze = async (mode: string) => {
    // update the status in the smart contract
    try {
      const currentAccount = await getCurrentAccount();
      console.log("Current Account: ", currentAccount);
      const buyerBalance = await contract.methods.getBuyerBalance().call();
      console.log("Buyer Balance: ", buyerBalance);
      const ownerAccount = await getOwnerAccount();
      console.log("Owner Account: ", ownerAccount);
      console.log("Contract Address: ", process.env.REACT_APP_CONTRACT_ADDRESS);
      // first initiate the payment,  if the payment is successful then freeze the PO
      if (mode === "heth") {
        const status = await contract.methods
          .payInHETH(process.env.REACT_APP_CONTRACT_ADDRESS, 100)
          .send({ from: currentAccount, gas: 3000000 });
        console.log("[handleFreeze] HETH status: ", status);
      } else {
        // const convertToHETH = (address: string, amount: string) => {
        //   return web3Instance.eth.abi.encodeFunctionCall(
        //     contractInfo.abi as any,
        //     [address, amount]
        //   );
        // };

        const price_num: number = parseInt(price, 10) * 0.0001;
        const priceInWei = web3Instance.utils.toWei(price_num + "", "ether");
        const status = await (window as any).ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: ownerAccount,
              value: priceInWei,
              // data: convertToHETH(ownerAccount, price_num + ""),
              gas: "100000",
            },
          ],
        });
        console.log("[handleFreeze] ETH status: ", status);
      }

      const result = await contract.methods
        .updateBuyerPhase("1", id, account)
        .send({ from: currentAccount, gas: "1000000" });
      console.log("result: ", result);
      setFreezeDisabled(true);
      setWithdrawDisabled(true);
    } catch (error) {
      const errorStr = (error as any).message;
      // const message = errorStr.substr(errorStr.lastIndexOf(":") + 1).trim();
      console.log("Error: ", errorStr);
      enqueueSnackbar(errorStr, { variant: "error" });
      handleClose();
    }
  };

  const handleWithdraw = async () => {
    // update the status in the smart contract
    try {
      const currentAccount = await getCurrentAccount();
      console.log("Current Account: ", currentAccount);
      const result = await contract.methods
        .updateBuyerPhase("2", id, account)
        .send({ from: currentAccount, gas: "1000000" });
      console.log("result: ", result);
      setWithdrawDisabled(true);
      setFreezeDisabled(true);
    } catch (error) {
      const errorStr = (error as any).message;
      const message = errorStr.substr(errorStr.lastIndexOf(":") + 1).trim();
      console.log("Error: ", message);
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  React.useEffect(() => {
    // if mode is owner
    if (buyerStatus === "2") {
      setNextDisabled(true);
    }
    if (supplierStatus === "0") {
      setActiveStep(0);
    } else if (supplierStatus === "1") {
      setActiveStep(1);
    } else if (supplierStatus === "2") {
      setActiveStep(2);
      setNextDisabled(true);
    }

    // if mode is buyer show the buttons
    if (buyerStatus === "1" || buyerStatus === "2") {
      setFreezeDisabled(true);
      setWithdrawDisabled(true);
    }
  }, []);

  return isOwner ? (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              pt: 2,
              float: "right",
            }}
          >
            <Button onClick={handleNext} disabled={nextDisabled}>
              {activeStep === steps.length - 1
                ? "Finish"
                : "Move to next phase"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  ) : (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"How do you want to pay?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please select the mode of payment from any of the buttons below.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => handleFreeze("eth")}>
            ETH
          </Button>
          <Button onClick={() => handleFreeze("heth")} autoFocus>
            HETH
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          alignContent: "space-between",
        }}
      >
        <Button
          variant="contained"
          disabled={freezeDisabled}
          sx={{ mr: 1 }}
          onClick={handleOpen}
        >
          Freeze
        </Button>
        <Button
          variant="text"
          disabled={withdrawDisabled}
          onClick={handleWithdraw}
        >
          Withdraw
        </Button>
      </Box>
    </>
  );
};

export default ProgressStepper;
