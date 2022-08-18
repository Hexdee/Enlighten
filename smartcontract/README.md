# Books

This smart contract stores all books uploaded to Enlighten and also mint them as NFTs

### secret.json
Provide your API keys and private key in `secret.json`

### Compile smart contract

```bash
npx hardhat compile
```

### Deploy smart contract

This would deploy the smart and display the contract address

```bash
npx hardhat run scripts/deploy.js
```

### Verify contract
Be sure to replace `YOUR_CONTRACT_ADDRESS` with the contract address you got after deploying the Smart Contract

```bash
npx hardhat verify `YOUR_CONTRACT_ADDRESS`
```
