import { Signer, Contract, BigNumber, ContractTransaction } from "ethers";
import { Provider } from '@ethersproject/providers';
import { contracts } from "../config/contracts";
import { panelsABI } from "../config/panelsABI";

export const paintOnPanel = async (tokenId: number, textToPaint: string, coordX: number, coordY: number, signerOrProvider?: Provider | Signer): Promise<ContractTransaction> => {
  const panel = new Contract(contracts.panels, panelsABI, signerOrProvider);

  const tx = await panel.paint(tokenId, textToPaint, coordX, coordY);

  return tx;
};
