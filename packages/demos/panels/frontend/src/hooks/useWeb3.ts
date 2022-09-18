import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Web3 } from "../types/Web3";

export const useWeb3 = (): [
  Web3 | undefined,
  React.Dispatch<React.SetStateAction<Web3 | undefined>>
] => {
  const [web3, setWeb3] = useState<Web3>();
  const ethereum = (window as any).ethereum;

  useEffect(() => {
    (async () => {
      if (ethereum) {
        await ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner(0);

        const address = await signer.getAddress();
        const network = await (await provider.getNetwork()).name;

        setWeb3({
          account: address,
          ethereumProvider: ethereum,
          provider: provider,
          signer: signer,
          network
        });
      } else {
        throw Error("Please install Metamask.");
      }
    })();
  }, [ethereum]);

  return [web3, setWeb3];
};