const { configDotenv } = require("dotenv");
const { ethers } = require("ethers");
const { abi } = require("./abi");
configDotenv();
exports.getContract = (pk, contractAddress) => {
  const provider = new ethers.getDefaultProvider(process.env.PROVIDER_URL);
  const wallet = new ethers.Wallet(pk, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);
  return { provider, wallet, contract };
};

exports.executeContractFaucet = async (
  provider,
  contract,
  contractToken,
  balance,
  id
) => {
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

    console.log(`Transaction ${id} sent! Hash:`, tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log(`Transaction ${id} mined! Block:`, receipt.blockNumber);
  } catch (error) {
    console.error("Error executing contract:", error);
  }
};
