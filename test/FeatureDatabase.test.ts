import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";

import hre from "hardhat";

describe("FeatureDatabase", () => {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.

    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default

        const [owner, otherAccount] = await hre.ethers.getSigners();

        const FeatureDatabase =
            await hre.ethers.getContractFactory("FeatureDatabase");

        const featDb = await FeatureDatabase.deploy();

        return { featDb, owner, otherAccount };
    }

    it("should receive a empty amount of features", async () => {
        const { featDb, owner, otherAccount } = await loadFixture(deployFixture);

        const amountOfFeats = await featDb.getAmount()

        expect(amountOfFeats).to.equal(0);
    });

    it("should start with empty", async () => {
        const { featDb, owner, otherAccount } = await loadFixture(deployFixture);

        const expiresAt = Math.floor(Date.now() / 1000) + 10 * 60; // 10 minutes from now

        await featDb.store({
            title: "New Feature",
            description: "This is a new feature",
            status: "PENDING",
            expiresAt,
            priority: 1,
        })

        expect(await featDb.getAmount()).to.equal(1);
    });
});
