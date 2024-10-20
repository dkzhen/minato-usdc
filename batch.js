const { ethers } = require("ethers");
const { getContract, executeContractFaucet } = require("./lib");
const fs = require("fs").promises;
const executeContract = async () => {
  try {
    const data = await fs.readFile("config.json", "utf-8");
    const privateKeys = JSON.parse(data);
    // weeth
    const valueInWei = ethers.utils.parseEther("0.1");
    const contractAddress = "0xF59f851ead4E36A143cbd14A77efe5a895272D65";
    const balance = valueInWei;
    const contractToken = "0x0ac1cc398342aab9f8ffe43dd578b2df59ceea5e";
    for (const privateKey of privateKeys) {
      const { provider, contract } = getContract(
        privateKey.pk,
        contractAddress
      );
      await executeContractFaucet(
        provider,
        contract,
        contractToken,
        balance,
        privateKey.id
      );
    }
  } catch (error) {
    console.error("Error executing contract:", error.message);
  }
};

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
