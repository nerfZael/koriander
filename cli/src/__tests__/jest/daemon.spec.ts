import http from "http";
import { startDaemon } from "../../commands/daemon";

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
    const server = await startDaemon(PORT, TIMEOUT);

    await stopServer(server);
  });
});
