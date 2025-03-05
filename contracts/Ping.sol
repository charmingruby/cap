// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Ping {
    string public message = "pong";

    function setMessage(string memory newMessage) public {
        message = newMessage;
    }
}
