import { PolywrapClient } from "@polywrap/client-js";
import { Command } from "commander";
import { startDaemon } from "./startDaemon";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";

export const daemonCommand = {
  register: (program: Command) => {
    program
      .command("daemon")
      .description("Run the koriander node daemon")
      .action(async () => {
        const config = {
          ethereum: {
            providers: {
              mainnet: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
              ropsten: `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
              rinkeby: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
              goerli: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
              polygon: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
            },
          }
        };

        await startDaemon(5137, 20000, new PolywrapClient({
          plugins: [
            {
              uri: "wrap://ens/ethereum.polywrap.eth",
              plugin: ethereumPlugin({
                networks:{
                  mainnet: {
                    provider: config.ethereum.providers.mainnet
                  },
                  ropsten: {
                    provider: config.ethereum.providers.ropsten
                  },
                  rinkeby: {
                    provider: config.ethereum.providers.rinkeby
                  },
                  goerli: {
                    provider: config.ethereum.providers.goerli
                  },
                  polygon: {
                    provider: config.ethereum.providers.polygon
                  },
                }
              }),
            },
          ]
        }));
      });
  }
};
