const solc = require("solc");
const fs = require("fs");
const path = require("path");

function compileContract(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const input = {
    language: "Solidity",
    sources: {
      [path.basename(filePath)]: { content: source }
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object"]
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contracts = output.contracts[path.basename(filePath)];

  for (const name in contracts) {
    const abi = contracts[name].abi;
    const bytecode = contracts[name].evm.bytecode.object;
    fs.writeFileSync(path.join(__dirname, `../abi/${name}.json`), JSON.stringify({ abi, bytecode }, null, 2));
    console.log(`✅ ABI saved for: ${name}`);
  }
}

compileContract(path.join(__dirname, "../contracts/Token.sol"));
compileContract(path.join(__dirname, "../contracts/GmContract.sol"));
