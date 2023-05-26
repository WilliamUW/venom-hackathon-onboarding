import { getRandomNonce, toNano } from "locklift";
import { sha256 } from "js-sha256";

async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!;
  const { contract: sample, tx } = await locklift.factory.deployContract({
    contract: "Sample",
    publicKey: signer.publicKey,
    initParams: {
      nonce: getRandomNonce(),
      owner: `0x${signer.publicKey}`,
    },
    constructorParams: {
      _state: 0,
    },
    value: toNano(1),
  });
  console.log(`Sample deployed at: ${sample.address.toString()}`);

  const hashes = [];
  const preimages = [];
  for (let i = 0; i < 2; i++) {
    const n = getRandomNonce();
    preimages.push(n.toString());
    const h = sha256(n.toString());
    hashes.push(`0x${h}`);
  }

  await sample.methods.addSessionKeys({
    hashes: hashes
  }).sendExternal({
    publicKey: signer!.publicKey
  });

  console.log("added sessions", hashes, preimages);

}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
