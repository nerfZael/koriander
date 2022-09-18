import { Signer, Contract, BigNumber } from "ethers";
import { Provider } from '@ethersproject/providers';
import { tokenEnumeratorABI } from "../config/tokenEnumeratorABI";

export const fetchTokenIdsForAccount = async (tokenEnumerator: string, tokenAddress: string, account: string, signerOrProvider?: Provider | Signer): Promise<number[]> => {
  console.log("fetchTokenIdsForAccount", tokenEnumerator, tokenAddress, account, signerOrProvider);
  const enumerator = new Contract(tokenEnumerator, tokenEnumeratorABI, signerOrProvider);

  const result: {
    ids: BigNumber[],
    total: BigNumber
  } = await enumerator.enumerateTokensOfOwner(tokenAddress, account, 0, 2);

  console.log("result", result);
  return result.ids.map(x => x.toNumber());
};
