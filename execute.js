const { configDotenv } = require("dotenv");
const { ethers } = require("ethers");
const { abi } = require("./abi");
configDotenv();
const provider = new ethers.getDefaultProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// usdc
// const contractAddress = "0xF59f851ead4E36A143cbd14A77efe5a895272D65";
// const balance = "100000000";
// const contractToken = "0x6F405A7fdc7b4B1Ffad1C821a6bA89f13b48c4F3";

// weth
const valueInWei = ethers.utils.parseEther("0.1");
const contractAddress = "0xF59f851ead4E36A143cbd14A77efe5a895272D65";
const balance = valueInWei;
const contractToken = "0x0ac1cc398342aab9f8ffe43dd578b2df59ceea5e";

// Create the contract instance
const contract = new ethers.Contract(contractAddress, abi, wallet);
async function executeContract() {
  try {
    // The amount to transfer (1 ETH)
    const gasPrice = await provider.getGasPrice(); // Get current network gas price
    const increasedGasPrice = gasPrice.mul(1); // Increase gas price (you can adjust the multiplier)
    const gasLimit = ethers.BigNumber.from("27000000");

    const tx = await contract.executeClaim(
      contractToken,
      balance,

      {
        gasLimit: gasLimit,
        gasPrice: increasedGasPrice,
      }
    );

    console.log("Transaction sent! Hash:", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction mined! Block:", receipt.blockNumber);
  } catch (error) {
    console.error("Error executing contract:", error);
  }
}

async function main() {
  try {
    // Your first main logic here
    await executeContract();
    // Simulate async work
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.error("Error in main1:", error);
    process.exit(1);
  }
}

(async function runAlternating() {
  for (let i = 0; i < 100; i++) {
    await main();
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
})();
