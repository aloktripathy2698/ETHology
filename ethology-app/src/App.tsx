import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Routes, Route, HashRouter } from "react-router-dom";
import "./App.css";
import SearchResultDetails from "./components/molecules/SearchResultDetails";
import RootView from "./components/RootView";
import SearchHome from "./components/SearchHome";
import SearchResults from "./components/SearchResults";
import themeOptions from "./theme/theme";
import Web3 from "web3";

function App() {
  const [accountList, setAccountList] = useState<Array<string>>([]);

  const loadWeb3 = async () => {
    const web3 = new Web3("http://localhost:7545");
    console.log(web3);
    const accounts: Array<string> = await web3.eth.getAccounts();
    console.log(accounts);
    setAccountList(accounts);
  };

  // initial load
  useEffect(() => {
    loadWeb3();
  });

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
