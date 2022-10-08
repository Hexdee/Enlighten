// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Books = await hre.ethers.getContractFactory("Books");
  const books = await Books.deploy();

  await books.deployed();

  console.log(
    `Book contract deployed to ${books.address}`
  );

  console.log("Before: ", await books.getBooks());
  await books.addBook("ipfs://bafybeiapftacyz44g3trfj7pc4sfcjm5n3jn4h4ekkidi2weljlwj2gifi/The Art of War_ Complete Text and Commentaries ( PDFDrive ).pdf");
  await books.addBook("ipfs://bafybeif2xeyg7f4kv5bqmq4r4ees6mhq5c5puidjkg6hnak34zrwhys4t4/Do the Work by Steven Pressfield ( PDFDrive ).pdf");
  await books.addBook("ipfs://bafybeickohcegm7pscnebjzem2yjn2bty2qneh2c3ezn4zyuaxitav5jba/Web_of_Mystery_01.pdf");
  const tx = await books.addBook("ipfs://bafybeibphma4owpbtcg3duahhpirjekhjauh6yscjelhvu44akzrtzs5i4/Jane Eyre ( PDFDrive ).pdf", );
  await tx.wait
  // await books.addBook("");
  console.log("After: ", await books.getBooks());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
