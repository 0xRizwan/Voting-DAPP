const hre = require("hardhat");
const {ethers} = require("ethers");

async function main() {

  const votingContract = await hre.ethers.getContractFactory("Voting");
  const deployedVotingContract = await votingContract.deploy("Voting");

  await deployedVotingContract.deployed();

  console.log( `Voting contract address: ${deployedVotingContract.address}` );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
