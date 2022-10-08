require("@nomicfoundation/hardhat-toolbox");
var secret = require("./secret.json");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.6",

  defaultNetwork: "testnet",
  networks: {
    hardhat: {
    },
    testnet: {
      url: "https://testnet-rpc.coinex.net",
      accounts: [`0x` + secret.PRIVATE_KEY],
      chainId: 53,
    },
  },
  etherscan: {
    apiKey: {
      testnet: secret.COINEXSCAN_API_KEY
    },
    customChains: [
      {
        network: "testnet",
        chainId: 53,
        urls: {
          apiURL: "https://testnet.coinex.net/api/v1",
          browserURL: "https://testnet.coinex.net"
        }
      }
    ]
  }
}
