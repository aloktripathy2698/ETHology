import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import "./App.css";
import { contract, web3Instance } from "./blockchain/load-contract-config";
import SearchResultDetails from "./components/molecules/SearchResultDetails";
import RootView from "./components/RootView";
import SearchHome from "./components/SearchHome";
import SearchResults from "./components/SearchResults";
import themeOptions from "./theme/theme";

function App() {
  const accountInfo = async () => {
    contract.methods
      .getCurrentPhase()
      .call()
      .then((phase: any) => {
        console.log(`Current phase: ${phase}`);
      });

    const accounts = await web3Instance.eth.getAccounts();
    const account = accounts[0];
    console.log(`Account: ${account}`);

    contract.methods
      .updatePhase(3)
      .send({ from: account })
      .then(() => {
        console.log("Phase updated");
      });
  };

  useEffect(() => {
    accountInfo();
  }, []);

  (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
    console.log("Metamask account changed! ", accounts);
  });

  // contract.methods
  //   .updatePhase(1)
  //   .send({ from: web3Instance.eth.accounts[0] })
  //   .then((res: any) => {
  //     console.log(res);
  //   });

  return (
    <div className="App">
      <SnackbarProvider maxSnack={1}>
        <ThemeProvider theme={themeOptions}>
          <HashRouter>
            <Routes>
              <Route
                path="/"
                element={<RootView root={<SearchHome />} hideFilter={true} />}
              />
              <Route
                path="/search"
                element={<RootView root={<SearchResults />} />}
              />
              <Route
                path="/search-details"
                element={
                  <RootView root={<SearchResultDetails />} hideFilter={true} />
                }
              />
            </Routes>
          </HashRouter>
        </ThemeProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
