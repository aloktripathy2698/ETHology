/***
 * Load all the Ethology related configurations and export them in single object
 */

import Web3 from "web3";
import contractInfo from "./build/contracts/Ethology.json";
import truffleConfig from "./truffle-config";

// instantiate the web3 object
const web3Instance: Web3 = new Web3(
  new Web3.providers.HttpProvider(
    `http://${truffleConfig.networks.development.host}:${truffleConfig.networks.development.port}`
  )
);

// console.log("web3: ", web3Instance);

// getting the deployed contract
const contract = new web3Instance.eth.Contract(
  contractInfo.abi as any,
  contractInfo.networks[5777].address
);

// console.log("[DEBUG] Contract info", contract);

const fetchAccountDetails = async () => {
  const accounts = await web3Instance.eth.getAccounts();
  console.log("[DEBUG] Accounts: ", accounts);
  return accounts;
};

// Metamask specific changes
// (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
//   console.log("Metamask account changed! ", accounts);
// });

export { web3Instance, contract, fetchAccountDetails };
