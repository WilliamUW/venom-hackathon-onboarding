import { sha256 } from "js-sha256";
import { Address, getRandomNonce, toNano } from "locklift";

async function main() {
  const signer = await locklift.keystore.getSigner("0");
  const sample = locklift.factory.getDeployedContract(
    "Sample", new Address("0:7eb1407ad1c8835dfdb116bcdfbd797eb2bd34d564edc914297741b512275703"));

  
}
  

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
