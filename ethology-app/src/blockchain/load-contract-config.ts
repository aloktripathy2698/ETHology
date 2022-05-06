/***
 * Load all the Ethology related configurations and export them in single object
 */

import Web3 from "web3";
import contractInfo from "./build/contracts/Ethology.json";
import truffleConfig from "./truffle-config";

const providerUrl =
  process.env.REACT_APP_MODE === "local"
    ? `http://${truffleConfig.networks.development.host}:${truffleConfig.networks.development.port}`
    : (process.env.REACT_APP_INFURA_ENDPOINT as string);

console.log("Provider URL: ", providerUrl);

// instantiate the web3 object
const web3Instance: Web3 = new Web3(
  new Web3.providers.HttpProvider(providerUrl)
);

console.log("[DEBUG] Contract address: ", process.env.REACT_APP_CONTRACT_ADDRESS);
// getting the deployed contract
const contract = new web3Instance.eth.Contract(
  contractInfo.abi as any,
  process.env.REACT_APP_MODE === "local"
    ? contractInfo.networks[5777].address
    : process.env.REACT_APP_CONTRACT_ADDRESS
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
