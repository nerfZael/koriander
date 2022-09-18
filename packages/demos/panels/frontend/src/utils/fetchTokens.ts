import { Contract, Signer } from "ethers";
import { Provider } from '@ethersproject/providers';
import { TokenInfo } from "../types/TokenInfo";
import { KorianderExtensionClient } from "./KorianderExtensionClient";
import { contracts } from "../config/contracts";
import { msgpackDecode } from "@polywrap/msgpack-js";

export const fetchTokens = async (tokenIds: number[], tokenAddress: string, signerOrProvider?: Provider | Signer): Promise<TokenInfo[]> => {
  const tokens: TokenInfo[] = [];

  for(const tokenId of tokenIds) {
    const imageUri = await getImageFromTokenId(tokenId, signerOrProvider);
    tokens.push({
      id: tokenId,
      imageUri,
    });
  }
  
  return tokens;
};

export const getImageFromTokenId = async (tokenId: number, signerOrProvider?: Provider | Signer): Promise<string> => {
  // const abi = [
  //   "function tokenURI(uint256 tokenId) public view returns (string memory)",
  // ];
  // const panel = new Contract(contracts.panels, abi, signerOrProvider);
 
  // const tokenUri = await panel.tokenURI(tokenId);
  // const metadataObj = await getMetadataFromLink(tokenUri)
  return await getImageFromLink("https://wrap.link/i/ens/eth-berlin-2022-panels.eth/image?id="+tokenId);
};

export const getMetadataFromLink = async (link: string): Promise<any> => {
  if(link.startsWith("https://wrap.link/i/")) {
    const path = link.replace("https://wrap.link/i/", "");
    const [authority, domain, ...rest] = path.split("/");
    const pathWithoutDomain = rest.join("/");
    const method = pathWithoutDomain.split("?")[0];
    const args = new URL(link).searchParams;

    const client = new KorianderExtensionClient();

    const result = await client.invoke({
      uri: `${authority}/${domain}`,
      method,
      args: paramsToObject(args),
    });

    if (result.error) {
      alert(result.error);
      throw result.error;
    }

    return result.data;
  }

  return link;
};

export const getImageFromLink = async (link: string): Promise<string> => {
  if(link.startsWith("https://wrap.link/i/")) {
    const path = link.replace("https://wrap.link/i/", "");
    const [authority, domain, ...rest] = path.split("/");
    const pathWithoutDomain = rest.join("/");
    const method = pathWithoutDomain.split("?")[0];
    const args = new URL(link).searchParams;

    const client = new KorianderExtensionClient();

    const result = await client.invoke({
      uri: `${authority}/${domain}`,
      method,
      args: paramsToObject(args),
    });

    if (result.error) {
      alert(result.error);
      throw result.error;
    }

    const buffer = (result.data as any).content as Uint8Array;
    const base64Buffer = Buffer.from(buffer).toString('base64');
    return `data:image/png;base64,${base64Buffer}`;
  }

  return link;
};

function paramsToObject(entries: URLSearchParams) {
  const result: Record<any, string> = {}
  for(const [key, value] of entries) { 
    result[key] = value;
  }
  return result;
}