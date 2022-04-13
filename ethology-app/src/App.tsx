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
import { MODE_DEBUG } from "./constants";

function App() {
  const [web3, setWeb3] = useState<Web3>();
  const [accountList, setAccountList] = useState<Array<string>>([]);

  const loadAccounts = async () => {
    const web3 = new Web3("http://localhost:7545");
    console.log(web3);
    setWeb3(web3);
    
    // if the web3 instance is defined, load the accounts
    const accounts: Array<string> = await web3.eth.getAccounts();
    MODE_DEBUG && console.log("[DEBUG] Account info", accounts);
    setAccountList(accounts);    
  };

  // initial load
  useEffect(() => {
    loadAccounts();
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
                  <RootView root={<SearchResultDetails />} hideFilter={true} web3={web3}/>
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
