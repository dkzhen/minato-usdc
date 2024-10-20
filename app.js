const fs = require("fs");
const { ethers } = require("ethers");
require("dotenv").config();

// Load the compiled contract ABI and Bytecode
const contractPath = "./contracts/ClaimExecutor.sol"; // Path to your .sol file
const solc = require("solc");
const { Network } = require("ethers");

// Compile the Solidity contract
function compileContract(contractPath) {
  const source = fs.readFileSync(contractPath, "utf8");
  const input = {
    language: "Solidity",
    sources: {
      "ClaimExecutor.sol": {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts["ClaimExecutor.sol"].ClaimExecutor;
  return contract;
}
const valueInWei = ethers.utils.parseEther("0.1");

const datas = [
  {
    external: "0x2d30b61f3ae45b0776cb49cb223f23f0c56bD3C9",
    token: "0x6F405A7fdc7b4B1Ffad1C821a6bA89f13b48c4F3",
    amount: 100000000,
  },
  {
    external: "0x2d30b61f3ae45b0776cb49cb223f23f0c56bD3C9",
    token: "0x0ac1cc398342aab9f8ffe43dd578b2df59ceea5e",
    amount: valueInWei || 100000000000000000,
  },
  // {
  //   external: "0x2d30b61f3ae45b0776cb49cb223f23f0c56bD3C9",
  //   token: "0x8cce37e4a9752dd313c5f842da3e57c7a1519d92",
  //   amount: 1000000000000000,
  // },
];

// Main async function for deploying and interacting with the contract
async function main() {
  const provider = new ethers.getDefaultProvider(process.env.PROVIDER_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Compile contract and get ABI and bytecode
  const contract = compileContract(contractPath);
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;

  // Deploy the contract
  console.log("Deploying the contract...");
  for (const data of datas) {
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    const externalContractAddress = data.external; // Replace with your external contract address
    const tokenAddress = data.token; // Replace with your ERC20 token address
    const deployedContract = await factory.deploy(
      externalContractAddress,
      tokenAddress
    );

    deployedContract.deploymentTransaction;
    const address = deployedContract.address;
    console.log(`Contract deployed at address: ${address}`);

    // Call the executeClaim function after deployment
    console.log("Calling executeClaim...");
    const gasPrice = await provider.getGasPrice(); // Get current network gas price
    const increasedGasPrice = gasPrice.mul(2); // Increase gas price (you can adjust the multiplier)
    const gasLimit = ethers.BigNumber.from("800000");

    const arg0 = data.token; // Replace with the correct address
    const arg1 = data.amount; // Example value for tokens (adjust as necessary)
    const tx = await deployedContract.executeClaim(arg0, arg1, {
      gasPrice: increasedGasPrice,
      gasLimit: gasLimit,
    });

    // Wait for the transaction to be confirmed
    await tx.wait();
    console.log("executeClaim transaction confirmed.");

    // Check token balance after claim
    const balance = await deployedContract.tokenBalance();
    console.log(
      `Contract token balance: ${ethers.utils.formatUnits(balance, 18)} tokens`
    );
  }
}

// Handle errors and execute the main function
async function main1() {
  try {
    // Your first main logic here
    await main();
    // Simulate async work
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.error("Error in main1:", error);
    process.exit(1);
  }
}

async function main2() {
  try {
    // Your second main logic here
    await main();
    // Simulate async work
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.error("Error in main2:", error);
    process.exit(1);
  }
}

(async function runAlternating() {
  for (let i = 0; i < 100; i++) {
    await main1();
    delay(3000);
    await main2();
    delay(3000);
  }
})();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
