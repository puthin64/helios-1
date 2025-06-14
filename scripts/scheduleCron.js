const { ethers, Wallet, JsonRpcProvider } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const cronABI = require("../abi/chronos.json").abi;
const gmABI = require("../abi/GmContract.json").abi;

async function main() {
  const provider = new JsonRpcProvider(process.env.RPC_URL);
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

  const cronAddress = "0x0000000000000000000000000000000000000830";
  const cronContract = new ethers.Contract(cronAddress, cronABI, wallet);

  const logPath = path.join(__dirname, "../gm-log.json");
  if (!fs.existsSync(logPath)) return console.error("❌ gm-log.json not found");

  const logs = JSON.parse(fs.readFileSync(logPath));
  const last = logs[logs.length - 1];
  if (!last) return console.error("❌ No previous GM contract found.");

  const tx = await cronContract.createCron(
    last.address,
    JSON.stringify(gmABI),
    "increment",
    [],
    60,
    0,
    400_000,
    ethers.parseUnits("2", "gwei"),
    ethers.parseEther("0.1")
  );

  await tx.wait();
  console.log("✅ Cron scheduled. TX Hash:", tx.hash);
}
main().catch(console.error);
