import { ReactElement, useState } from "react";
import "react-app-polyfill/stable";
import "react-app-polyfill/ie11";
import "core-js/features/array/find";
import "core-js/features/array/includes";
import "core-js/features/number/is-nan";
import { KorianderExtensionClient } from "../utils/KorianderExtensionClient";

const Home = (): ReactElement<any, any> => {
  const [filePath, setFilePath] = useState<string>("");
  const [fileText, setFileText] = useState<string>("");

  const writeToFile = async (filePath: string) => {
    const client = new KorianderExtensionClient();

    const result = await client.invoke({
      uri: `ens/fs.polywrap.eth`,
      method: "writeFile",
      args: {
        path: filePath,
        data: fileText,
      },
    });

    if (result.error) {
      alert(result.error);
      console.error(result.error);
    }
  };

  return (
    <div>
      <div className="page">
        <h1>Dashboard</h1>
        <div>
          <div>
            <input
              className="form-control"
              placeholder="File path..."
              type="text"
              onChange={(e) => {
                setFilePath(e.target.value);
              }}
            />
            <button
              className="btn btn-success"
              onClick={async (e) => {
                writeToFile(filePath);
              }}
              >
              Write
            </button>
          </div>
          <div>
            <textarea
                className="form-control"
                placeholder="File text..."
                onChange={(e) => {
                  setFileText(e.target.value);
                }}
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
