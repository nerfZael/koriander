#!/usr/bin/env node
import { program } from "commander";
import { daemonCommand } from "./commands/daemon";

(async () => {
  daemonCommand.register(program);
    
  program.parse(process.argv);
})();
