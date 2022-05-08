/***
 * Load all the Ethology related configurations and export them in single object
 */

import Web3 from "web3";
import contractInfo from "./build/contracts/Ethology.json";
import truffleConfig from "./truffle-config";

const HDWalletProvider = require("@truffle/hdwallet-provider");

const providerUrl =
  process.env.REACT_APP_MODE === "local"
    ? `http://${truffleConfig.networks.development.host}:${truffleConfig.networks.development.port}`
    : (process.env.REACT_APP_INFURA_ENDPOINT as string);

console.log("Provider URL: ", providerUrl);
console.log(
  "[load-contract-config] providerUrl: ",
  process.env.REACT_APP_INFURA_ENDPOINT
);

// instantiate the web3 object
// const web3Instance: Web3 = new Web3(
//   new HDWalletProvider({
//     privateKeys: [
//       process.env.REACT_APP_PRIVATE_KEY1,
//       process.env.REACT_APP_PRIVATE_KEY2,
//       process.env.REACT_APP_PRIVATE_KEY3,
//     ],
//     url: process.env.REACT_APP_INFURA_ENDPOINT,
//   })
// );

// const web3Instance: Web3 = new Web3(
//   new Web3.providers.HttpProvider(providerUrl)
// );

const web3Instance: Web3 = new Web3((window as any).ethereum);

console.log(
  "[DEBUG] Contract address: ",
  process.env.REACT_APP_CONTRACT_ADDRESS
);

// contractInfo.networks[5777].address

const contractAddress =
  process.env.REACT_APP_MODE === "local"
    ? process.env.REACT_APP_CONTRACT_ADDRESS
    : process.env.REACT_APP_CONTRACT_ADDRESS;

// getting the deployed contract
const contract = new web3Instance.eth.Contract(
  contractInfo.abi as any,
  contractAddress
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

export { web3Instance, contract, fetchAccountDetails, contractAddress };
