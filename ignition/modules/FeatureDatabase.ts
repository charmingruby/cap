// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FeatureDatabase = buildModule("FeatureDatabase", (m) => {
  const featureDb = m.contract("FeatureDatabase");

  return { featureDb };
});

export default FeatureDatabase;
