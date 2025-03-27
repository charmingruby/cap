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

    describe("store", async () => {
        it("should be able to add a new feature", async () => {
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
    })

    describe("save", async () => {
        it("should be able to update a feature", async () => {
            const { featDb, owner, otherAccount } = await loadFixture(deployFixture);

            const expiresAt = Math.floor(Date.now() / 1000) + 10 * 60; // 10 minutes from now

            const feat = {
                title: "New Feature",
                description: "This is a new feature",
                status: "PENDING",
                expiresAt,
                priority: 1,
            }

            await featDb.store(feat);

            const amountOfFeats = await featDb.getAmount();

            expect(amountOfFeats).to.equal(1);

            const newStatus = "APPROVED";
            feat.status = newStatus;

            await featDb.save(amountOfFeats, feat);

            const updatedFeat = await featDb.features(amountOfFeats);

            expect(updatedFeat.status).to.equal(newStatus);
        });

        it("should be able not able update a feature that does not exists", async () => {
            const { featDb, owner, otherAccount } = await loadFixture(deployFixture);

            const amountOfFeats = await featDb.getAmount();

            expect(amountOfFeats).to.equal(0);

            const expiresAt = Math.floor(Date.now() / 1000) + 10 * 60; // 10 minutes from now

            const feat = {
                title: "New Feature",
                description: "This is a new feature",
                status: "PENDING",
                expiresAt,
                priority: 1,
            }

            await expect(featDb.save(amountOfFeats + BigInt(1), feat)).to.be.revertedWith(
                "Feature does not exist"
            );
        });
    })

    describe("remove", async () => {
        it("should be able to remove an existing feature", async () => {
            const { featDb, owner, otherAccount } = await loadFixture(deployFixture);

            const expiresAt = Math.floor(Date.now() / 1000) + 10 * 60; // 10 minutes from now

            const feat = {
                title: "New Feature",
                description: "This is a new feature",
                status: "PENDING",
                expiresAt,
                priority: 1,
            }

            await featDb.store(feat);

            const amountOfFeats = await featDb.getAmount();

            expect(await featDb.getAmount()).to.equal(1);

            await featDb.remove(amountOfFeats);

            expect(await featDb.getAmount()).to.equal(0);
        });

        it("should be not able remove a feature if the sender is not the contract owner", async () => {
            const { featDb, owner, otherAccount } = await loadFixture(deployFixture);

            const notOwnerFeatDbInstance = featDb.connect(otherAccount);

            const expiresAt = Math.floor(Date.now() / 1000) + 10 * 60; // 10 minutes from now

            const feat = {
                title: "New Feature",
                description: "This is a new feature",
                status: "PENDING",
                expiresAt,
                priority: 1,
            }

            await notOwnerFeatDbInstance.store(feat);

            const amountOfFeats = await notOwnerFeatDbInstance.getAmount();

            const currentAmount = await notOwnerFeatDbInstance.getAmount()
            expect(currentAmount).to.equal(1);

            await expect(notOwnerFeatDbInstance.remove(amountOfFeats)).to.be.revertedWith(
                "Only the owner can remove features"
            );

            expect(await notOwnerFeatDbInstance.getAmount()).to.equal(currentAmount);
        });
    })
});
