import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/molecules/Dashboard";
import SearchResultDetails from "./components/molecules/SearchResultDetails";
import RootView from "./components/RootView";
import SearchHome from "./components/SearchHome";
import SearchResults from "./components/SearchResults";
import themeOptions from "./theme/theme";

function App() {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const dashboardComponent = <SearchResultDetails />;

  const getOwnerAddress = async () => {
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    console.log(`Current Account: ${account}`);
    // save it in the localstorage
    localStorage.setItem("currentAccount", account);
  };

  useEffect(() => {
    // store the owner account in the localstorage during the very first time
    getOwnerAddress();

    // event to get triggered every time the account changes
    (window as any).ethereum.on(
      "accountsChanged",
      function (accounts: string[]) {
        // Time to reload your interface with accounts[0]!
        console.log("[APP] Current Account: ", accounts[0]);
        setCurrentAccount(accounts[0]);
        // route to the home page
        window.location.href = "/";
      }
    );

    // check if owner logged in
    (window as any).ethereum.removeListener(
      "accountsChanged",
      function (accounts: string[]) {
        // Time to reload your interface with accounts[0]!
        console.log("[APP unmount] Current Account: ", accounts[0]);
        setCurrentAccount(accounts[0]);
      }
    );
  }, []);

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
                  <RootView root={dashboardComponent} hideFilter={true} />
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RootView
                    root={<Dashboard currentAccount={currentAccount} />}
                    hideFilter={true}
                  />
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
