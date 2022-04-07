import { useEffect, useState } from "react";
import "./App.css";
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
      {accountList.length ? (
        accountList.map((account: string) => {
          return <div>{account}</div>;
        })
      ) : (
        <div>No accounts found</div>
      )}
    </div>
  );
}

export default App;
