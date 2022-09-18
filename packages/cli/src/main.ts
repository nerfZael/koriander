#!/usr/bin/env node
import { program } from "commander";
import * as dotenv from "dotenv"
import { daemonCommand } from "./commands/daemon";

dotenv.config();

(async () => {
  daemonCommand.register(program);
    
  program.parse(process.argv);
})();
