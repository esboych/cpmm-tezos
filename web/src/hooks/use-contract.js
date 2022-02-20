import { useState, useEffect } from "react";

//const CONTRACT_ADDRESS = "KT1DpPyhtDXJVj4guBJRkkYFQEXs68ugR8Nm";
//const CONTRACT_ADDRESS = "KT1HzJJF8Lkm7F5mDki3kMw3vjAs2Nk7vSN7";
const CONTRACT_ADDRESS = "KT1GEssaBuyqaLgRZNH8pRedcAxnGMeNDooq";

export function useContract(tezos) {
  const [contract, setContract] = useState(null);
  const [error, setError] = useState("");
  const [storage, setStorage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [operationsCount, setOperationsCounter] = useState(0);

  useEffect(() => {
    loadStorage(contract);
  }, [contract, operationsCount]);

  return {
    contract,
    error,
    storage,
    loading,
    operationsCount,
    connect,
    increaseOperationsCount,
  };

  function increaseOperationsCount() {
    setOperationsCounter(operationsCount + 1);
  }

  async function connect() {
    setLoading(true);
    try {
      const contractInstance = await tezos.wallet.at(CONTRACT_ADDRESS);
      setContract(contractInstance);
      increaseOperationsCount();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadStorage(contract) {
    if (!contract) {
      return;
    }
    try {
      setLoading(true);
      const storage = await contract.storage();
      setStorage(storage);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
}
