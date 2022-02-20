import { useState, useEffect } from "react";

export function useBalanceState(
  tezos,
  address = "",
  contractOperationsCount = 0
) {
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBalance(address);
  }, [address, contractOperationsCount]);

  return { balance, error, loading };

  async function loadBalance(address) {
    if (!address) {
      return;
    }
    try {
      setLoading(true);
      const balance = await tezos.tz.getBalance(address);
      setBalance(balance / 10 ** 6);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
}
