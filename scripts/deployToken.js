const { ethers, Wallet, JsonRpcProvider } = require("ethers");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const abi = require("../abi/Token.json").abi;
const bytecode = require("../abi/Token.json").bytecode;

async function main() {
    const provider = new JsonRpcProvider(process.env.RPC_URL);
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    const name = "MyToken";
    const symbol = "MTK";
    const supply = 1000000;
    const decimals = 18;

    console.log("Deploying token...");
    const contract = await factory.deploy(name, symbol, supply, decimals);
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("✅ Token deployed at:", address);

    // Simpan ke log
    const logPath = path.join(__dirname, "../gm-log.json");
    const logs = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : [];
    logs.push({ address, name, symbol, supply, decimals, timestamp: new Date().toISOString() });
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
}

main().catch(console.error);
