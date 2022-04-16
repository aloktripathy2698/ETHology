// Outer utils file for helper functions

import { contract } from "./blockchain/load-contract-config";

const isOwnerLoggedIn = async () => {
  const owner: string = await contract.methods.getSupplier().call();
  console.log("[Utils] Owner from SC: ", owner);
  return (
    owner.toLowerCase() ===
    (localStorage.getItem("currentAccount") as string).toLowerCase()
  );
};

const getCurrentAccount = () => {
  return (localStorage.getItem("currentAccount") as string) || "";
};

export { isOwnerLoggedIn, getCurrentAccount };
