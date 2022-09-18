import { ReactElement, useEffect, useState } from "react";
import "react-app-polyfill/stable";
import "react-app-polyfill/ie11";
import "core-js/features/array/find";
import "core-js/features/array/includes";
import "core-js/features/number/is-nan";
import { useWeb3 } from "../hooks/useWeb3";
import { fetchTokenIdsForAccount } from "../utils/fetchTokenIdsForAccount";
import { contracts } from "../config/contracts";
import { fetchAllTokenIds } from "../utils/fetchAllTokenIds";
import { fetchTokens } from "../utils/fetchTokens";
import { TokenInfo } from "../types/TokenInfo";
import { paintOnPanel } from "../utils/paintOnPanel";

const Home = (): ReactElement<any, any> => {
  const [myNfts, setMyNfts] = useState<TokenInfo[]>([]);
  const [allNfts, setAllNfts] = useState<TokenInfo[]>([]);
  const [selectedNft, setSelectedNft] = useState<TokenInfo | undefined>();
  const [textToPaint, setTextToPaint] = useState<string>("");
  const [coords, setCoords] = useState<string>("");

  const [web3] = useWeb3();

  const refresh = async () => {
    if(!web3?.account) {
      return;
    }
    setAllNfts(
      await fetchTokens(await fetchAllTokenIds(
        contracts.tokenEnumerator, 
        contracts.panels,
        web3?.signer
      ), contracts.panels, web3?.signer)
    );
  };
  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, [web3]);

  const paint = async (nft: TokenInfo, textToPaint: string, coords: string) => {
    const coordinates = coords.split(",").map((c) => parseInt(c));
    const tx = await paintOnPanel(nft.id, textToPaint, coordinates[0], coordinates[1], web3?.signer);
    await tx.wait();
    setSelectedNft(undefined);
    await refresh();
  };

  return (
    <div>
      <div className="page">
        <h1>Collection</h1>
        <div>
          <div>
            <div>
              <h2>Selected</h2>
            </div>
            <div>
            {
              selectedNft
                ? (
                  <>
                    <div>
                      <input
                        className="form-control"
                        placeholder="Text to paint..."
                        type="text"
                        onChange={(e) => {
                          setTextToPaint(e.target.value);
                        }}
                      />
                      <input
                        className="form-control"
                        placeholder="Coords..."
                        type="text"
                        onChange={(e) => {
                          setCoords(e.target.value);
                        }}
                      />
                      <button onClick={() => paint(selectedNft, textToPaint, coords)}>Paint</button>
                    </div>
                    <div>
                      <img src={`${selectedNft.imageUri}`} />
                    </div>
                  </>
                )
                : <div>No NFT selected</div>
            }
            </div>
          </div>
          <div>
            <div>
              <h2>All NFTs</h2>
            </div>
            <div>
            {
              allNfts && allNfts.length && allNfts.map((nft, index) => {
                return (
                  <div onClick={() => setSelectedNft(nft)}>
                    <img src={`${nft.imageUri}`} />
                  </div>
                )
              })
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
