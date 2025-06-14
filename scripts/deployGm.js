const { ethers, Wallet, JsonRpcProvider } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const abi = require("../abi/GmContract.json").abi;
const bytecode = require("../abi/GmContract.json").bytecode;

async function main() {
  const provider = new JsonRpcProvider(process.env.RPC_URL);
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

  const now = new Date();
  const message = `GM 🌞 ${now.toDateString()} - ${now.toLocaleTimeString()}`;
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  console.log("Deploying GmContract with message:", message);
  const contract = await factory.deploy(message);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ GM Contract deployed at:", address);

  const logPath = path.join(__dirname, "../gm-log.json");
  const logs = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : [];
  logs.push({ address, message, timestamp: new Date().toISOString() });
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
}
main().catch(console.error);
