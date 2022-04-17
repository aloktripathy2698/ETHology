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

const ProgressStepper = (props: IProgressStepper) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [nextDisabled, setNextDisabled] = React.useState(false);
  const [withdrawDisabled, setWithdrawDisabled] = React.useState(false);
  const [freezeDisabled, setFreezeDisabled] = React.useState(false);
  const { id, steps, account, buyerStatus, supplierStatus, isOwner, price } =
    props;
  const { enqueueSnackbar } = useSnackbar();

  const handleNext = async () => {
    if (supplierStatus === "2") {
      setNextDisabled(true);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      return;
    }
    // check if user status is freeze or not yet
    if (buyerStatus !== "1") {
      enqueueSnackbar("Buyer has not frozen the PO yet", {
        variant: "warning",
      });
      return;
    }

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

    // finally set the next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleFreeze = async () => {
    // update the status in the smart contract
    try {
      const currentAccount = await getCurrentAccount();
      console.log("Current Account: ", currentAccount);
      const buyerBalance = await contract.methods.getBuyerBalance().call();
      console.log("Buyer Balance: ", buyerBalance);
      const ownerAccount = await getOwnerAccount();
      console.log("Owner Account: ", ownerAccount);

      // first initiate the payment,  if the payment is successful then freeze the PO
      // const status = await contract.methods.initiatePayment(id).send({
      //   from: currentAccount,
      //   // value: price,
      //   value: web3Instance.utils.toWei("99", "ether"),
      //   gas: 3000000,
      // });
      // console.log("[handleFreeze] status: ", status);
      const status = await (window as any).ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: ownerAccount,
            value: web3Instance.utils.toWei("0.01", "ether"),
            gas: "100000",
          },
        ],
      });
      console.log("[handleFreeze] status: ", status);

      const result = await contract.methods
        .updateBuyerPhase("1", id, account)
        .send({ from: currentAccount, gas: "1000000" });
      console.log("result: ", result);
      setFreezeDisabled(true);
    } catch (error) {
      const errorStr = (error as any).message;
      // const message = errorStr.substr(errorStr.lastIndexOf(":") + 1).trim();
      console.log("Error: ", errorStr);
      enqueueSnackbar(errorStr, { variant: "error" });
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
        onClick={handleFreeze}
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
  );
};

export default ProgressStepper;
