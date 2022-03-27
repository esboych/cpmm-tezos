import { useState } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";

export function useWallet(tezos) {
  const [initialized, setInit] = useState(false);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return { initialized, address, error, loading, connect };

  async function connect() {
    try {
      setLoading(true);
      const { address } = await initWallet();
      setInit(true);
      setAddress(address);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function initWallet() {
    const options = {
      name: "Tezos Application app",
    };
    const wallet = new BeaconWallet(options);
    
    //const network = { type: "hangzhounet" };
    const network = { type: 'custom', name: "sandbox-2", rpcUrl: "http://localhost:20001/", };
    await wallet.requestPermissions({ network });

    // j: Ok so looks like the problem was with this network:
    // await wallet.requestPermissions({
    //   network: {
    //     type: 'mainnet' | 'granadanet' | 'hangzhounet' | 'custom',
    //   },
    // });
    tezos.setWalletProvider(wallet);
    console.log({ wallet });
    const address = await wallet.getPKH();
    
    return { address };
  }
}
