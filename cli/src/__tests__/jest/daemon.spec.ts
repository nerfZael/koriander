import { PolywrapClient } from "@polywrap/client-js";
import http from "http";
import { startDaemon } from "../../commands/daemon";
import { PolywrapRemoteHttpClient } from "../utils/PolywrapRemoteHttpClient";

jest.setTimeout(30000);

const PORT = 5137;
const TIMEOUT = 5000;

export const stopServer = async (server: http.Server) => {
  return new Promise<void>((resolve, reject) => {
    server.close(() => {
      resolve()
    });
  });
}

describe("Daemon", () => {
  it("can start and stop daemon", async () => {
    const server = await startDaemon(PORT, TIMEOUT, new PolywrapClient());
    await stopServer(server);
  });

  it("can execute a wrapper remotely", async () => {
    const server = await startDaemon(PORT, TIMEOUT, new PolywrapClient());

    const remoteClient = new PolywrapRemoteHttpClient(`http://localhost:${PORT}/client`);

    const result = await remoteClient.invoke({
      uri: `file/${__dirname}/../wrappers/simple`,
      method: "simpleMethod",
      args: {
        arg: "test execution"
      }
    });

    expect(result.data).toEqual("test execution");

    await stopServer(server);
  });
});
