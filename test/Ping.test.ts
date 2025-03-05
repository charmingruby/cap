import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Ping", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Ping = await hre.ethers.getContractFactory("Ping");
    const ping = await Ping.deploy();

    return { ping , owner, otherAccount };
  }

    it("should receive pong reply", async function () {
      const { ping, owner, otherAccount } = await loadFixture(deployFixture);

      const message = await ping.message(); 

      expect(message).to.equal("pong");
    });

    it("should be able to send a custom ping message", async function () {
      const { ping, owner, otherAccount } = await loadFixture(deployFixture);

       await ping.setMessage('OK!'); 

      expect(await ping.message()).to.equal("OK!");
    });
});
