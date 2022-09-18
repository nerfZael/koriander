// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/ETHBerlin2022Panel.sol";

contract DeployNFT is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
            
        new ETHBerlin2022Panel(
            0xE9FFd2d4c1e3eAF13f6e17DfDCD615a66f357dF4, 
            "ETH Berlin 2022 Panel", 
            "ETHBerlin2022Panel", 
            "https://wrap.link/i/ens/eth-berlin-2022-panels.eth/metadata?id="
        );

        vm.stopBroadcast();
    }
}
