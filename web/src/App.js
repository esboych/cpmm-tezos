import React, { useEffect } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from '@taquito/signer';

import { useWallet } from "./hooks/use-wallet";
import { useBalanceState } from "./hooks/use-balance-state";
import { useContract } from "./hooks/use-contract";
import {ConfigEnv} from "./config";



//j
import { BeaconWallet } from "@taquito/beacon-wallet";

export default function App(props) {
  var value = props.value
  const tezos = new TezosToolkit("http://localhost:20001");


  const TEST = process.env.REACT_APP_TEST;
  const TOKEN_ADDRESS = process.env.REACT_APP_FA12_TOKEN_ADDRESS;
  
  var {env_val} = ConfigEnv();

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
    CONTRACT_ADDRESS,
    operationsCount,
    connect: connectToContract,
    increaseOperationsCount,
  } = useContract(tezos);
  var {
    balance,
    error: balanceError,
    loading: balanceLoading,
  } = useBalanceState(tezos, address, operationsCount);

  const [operationLoading, setOperationLoading] = React.useState(false);
  const [operationError, setOperationError] = React.useState("");
  const [inputName, setTezos] = React.useState(1);
  const [inputAge, setAge] = React.useState(0);

  useEffect(() => {
    if (storage) {
      setTezos(storage.name);
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
            Config test val: {env_val}
          </div>
          <div>
            Current env: {process.env.NODE_ENV}
          </div>
          <div>
            Current Age: {contractLoading ? "Loading..." : Number(storage.age)}
          </div>
          <div>Wallet address: {walletLoading ? "Loading..." : address}</div>
          <div>Contract address: {contractLoading ? "Loading..." : CONTRACT_ADDRESS}</div>
          <div>Token address: {TOKEN_ADDRESS}</div>
          <div>Balance: {balanceLoading ? "Loading..." : balance}</div>
          <div>Balance live: {value}</div>
        </>
      )}
      {walletError && <div>Wallet Error: {walletError}</div>}
      {balanceError && <div>Balance Error: {balanceError}</div>}
      {contractError && <div>Contract Error: {contractError}</div>}
      {operationError && <div>Operation Error: {operationError}</div>}
      {initialized ? (
        <p>
          Tezos to spent:
          <input
            value={inputName}
            //   onFocus="''"
            onChange={(e) => setTezos(e.target.value)}
          ></input>
          Tokens to buy:
          <input
            value={inputAge}
            onChange={(e) => setAge(e.target.value)}
          ></input>
          <button
            disabled={contractLoading || operationLoading}
            onClick={() => submit(inputName, inputAge)}
          >
            Exchange
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

//   async function sendTz() {
//     var address = 'KT1NEiDJ5rBmJT4xA1JC3HsP7BGVWVCgwn7j' //sender_back_fa12
//     var amount = 1

//     console.log(`Transfering ${amount} ꜩ to ${address}...`);
//     tezos.contract.transfer({ to: address, amount: amount })
//         .then(op => {
//             console.log(`Waiting for ${op.hash} to be confirmed...`);
//             return op.confirmation(1).then(() => op.hash);
//         })
//         .then(hash => console.log(`${hash}`))
//         .catch(error => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
// }

  async function submit(tezos, age) {
    if (!contract) {
      return;
    }
    try {
      setOperationError("")
      // an address of simpleFA1.2 token
      //const addr = "KT1VNo3ay8m5ZgGDaYT4a4tSMqMYs4TUyn6M";
      //const setAllOp = await contract.methods.setAll(name, Number(age)).send(); //app.ligo
      //const setAllOp = await contract.methods.default(addr).send({amount: Number(tezos)});
      const setAllOp = await contract.methods.default(TOKEN_ADDRESS).send({amount: Number(tezos)});
      //await sendTz()
      await setAllOp.confirmation();
      increaseOperationsCount()
    } catch (error) {
      setOperationError(error.message);
    }
  }
}
