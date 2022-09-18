import { writeToFile } from "../utils/writeToFile";

import { ReactElement, useState } from "react";
import "react-app-polyfill/stable";
import "react-app-polyfill/ie11";
import "core-js/features/array/find";
import "core-js/features/array/includes";
import "core-js/features/number/is-nan";

const Home = (): ReactElement<any, any> => {
  const [filePath, setFilePath] = useState<string>("file.txt");
  const [fileText, setFileText] = useState<string>("Jurad");

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
              value={filePath}
              onChange={(e) => {
                setFilePath(e.target.value);
              }}
            />
            <button
              className="btn btn-success"
              onClick={async (e) => {
                writeToFile(filePath, fileText);
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
              value={fileText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
