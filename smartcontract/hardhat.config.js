require("@nomicfoundation/hardhat-toolbox");
var secret = require("./secret.json");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",

  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/v1/${secret.APP_ID}`,
      accounts: [secret.PRIVATE_KEY1, secret.PRIVATE_KEY2 ]
    }
  },
  etherscan: {
    apiKey: secret.POLYGONSCAN_API_KEY
  }
}
