import { Signer } from "ethers";
import { Provider } from '@ethersproject/providers';
import { TokenInfo } from "../types/TokenInfo";
import { KorianderExtensionClient } from "./KorianderExtensionClient";

export const fetchTokens = async (tokenIds: number[], tokenAddress: string, signerOrProvider?: Provider | Signer): Promise<TokenInfo[]> => {
  const tokens: TokenInfo[] = [];

  for(const tokenId of tokenIds) {
    const imageUri = await getImageFromLink(`https://wrap.link/i/ens/eth-berlin-2022-panels.eth/image?id=${tokenId}`);
    tokens.push({
      id: tokenId,
      imageUri,
    });
  }
  
  return tokens;
};

export const getImageFromLink = async (link: string): Promise<string> => {
  if(link.startsWith("https://wrap.link/i/")) {
    const path = link.replace("https://wrap.link/i/", "");
    const [authority, domain, ...rest] = path.split("/");
    const pathWithoutDomain = rest.join("/");
    const method = pathWithoutDomain.split("?")[0];
    const args = new URL(link).searchParams;

    console.log({
      authority,
      domain,
      method,
      args: paramsToObject(args)
    });

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