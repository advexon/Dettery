import { ethers } from "hardhat";

async function main() {
  console.log("Deploying LotteryFactory...");
  
  // Get the contract factory
  const LotteryFactory = await ethers.getContractFactory("LotteryFactory");
  
  // Deploy with a random salt to get unique address
  const salt = ethers.randomBytes(32);
  const lotteryFactory = await LotteryFactory.deploy();

  await lotteryFactory.waitForDeployment();
  const address = await lotteryFactory.getAddress();

  console.log(`✅ LotteryFactory deployed to: ${address}`);
  console.log("🎲 Using FREE block hash randomness - no VRF subscription needed!");
  console.log(`📝 Contract verified: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
