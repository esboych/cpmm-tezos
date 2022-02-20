import React, { useEffect } from "react";
import { TezosToolkit } from "@taquito/taquito";

import { useWallet } from "./hooks/use-wallet";
import { useBalanceState } from "./hooks/use-balance-state";
import { useContract } from "./hooks/use-contract";

export default function App() {
  //const tezos = new TezosToolkit("https://delphinet-tezos.giganode.io");
  const tezos = new TezosToolkit("http://localhost:20001");

  const {
    initialized,
    address,
    error: walletError,
    loading: walletLoading,
    connect: connectToWallet,
  } = useWallet(tezos);
  const {
    storage,
    error: contractError,
    loading: contractLoading,
    contract,
    operationsCount,
    connect: connectToContract,
    increaseOperationsCount,
  } = useContract(tezos);
  const {
    balance,
    error: balanceError,
    loading: balanceLoading,
  } = useBalanceState(tezos, address, operationsCount);

  const [operationLoading, setOperationLoading] = React.useState(false);
  const [operationError, setOperationError] = React.useState("");
  const [inputName, setName] = React.useState("");
  const [inputAge, setAge] = React.useState(0);

  useEffect(() => {
    if (storage) {
      setName(storage.name);
      setAge(storage.age);
    }
  }, [storage]);

  return (
    <div className="app" crossOrigin="true">
      {initialized && (
        <>
          <div>
            Current Name: {contractLoading ? "Loading..." : storage.name}
          </div>
          <div>
            Current Age: {contractLoading ? "Loading..." : Number(storage.age)}
          </div>
          <div>Address: {walletLoading ? "Loading..." : address}</div>
          <div>Balance: {balanceLoading ? "Loading..." : balance}</div>
        </>
      )}
      {walletError && <div>Wallet Error: {walletError}</div>}
      {balanceError && <div>Balance Error: {balanceError}</div>}
      {contractError && <div>Contract Error: {contractError}</div>}
      {operationError && <div>Operation Error: {operationError}</div>}
      {initialized ? (
        <p>
          Enter Name:
          <input
            value={inputName}
            //   onFocus="''"
            onChange={(e) => setName(e.target.value)}
          ></input>
          Enter Age:
          <input
            value={inputAge}
            onChange={(e) => setAge(e.target.value)}
          ></input>
          <button
            disabled={contractLoading || operationLoading}
            onClick={() => submit(inputName, inputAge)}
          >
            Update
          </button>
          {operationLoading && `Loading...`}
        </p>
      ) : (
        <button onClick={connect}> Connect </button>
      )}
    </div>
  );

  async function connect() {
    await connectToWallet();
    await connectToContract();
  }

  async function submit(name, age) {
    if (!contract) {
      return;
    }
    try {
      const addr = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb";
      //const setAllOp = await contract.methods.setAll(name, Number(age)).send(); //app.ligo
      const setAllOp = await contract.methods.default(addr).send();
      await setAllOp.confirmation();
    } catch (error) {
      setOperationError(error.message);
    }
  }
}
