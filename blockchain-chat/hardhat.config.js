require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  paths: { artifacts: "./frontend/src/artifacts" },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};
