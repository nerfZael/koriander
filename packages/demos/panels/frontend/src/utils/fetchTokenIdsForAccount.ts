import { Signer, Contract, BigNumber } from "ethers";
import { Provider } from '@ethersproject/providers';
import { tokenEnumeratorABI } from "../config/tokenEnumeratorABI";

export const fetchTokenIdsForAccount = async (tokenEnumerator: string, tokenAddress: string, account: string, signerOrProvider?: Provider | Signer): Promise<number[]> => {
  const enumerator = new Contract(tokenEnumerator, tokenEnumeratorABI, signerOrProvider);

  const result: {
    ids: BigNumber[],
    total: BigNumber
  } = await enumerator.enumerateTokensOfOwner(tokenAddress, account, 0, 5);

  return result.ids.map(x => x.toNumber());
};
