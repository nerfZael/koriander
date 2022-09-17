import { PolywrapClient } from "@polywrap/client-js";
import { Command } from "commander";
import { startDaemon } from "./startDaemon";

export const daemonCommand = {
  register: (program: Command) => {
    program
      .command("daemon")
      .description("Run the koriander node daemon")
      .action(async () => {
        await startDaemon(5137, 20000, new PolywrapClient());
      });
  }
};
