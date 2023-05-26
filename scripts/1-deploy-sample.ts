import { Address, getRandomNonce, toNano } from "locklift";
import { sha256 } from "js-sha256";

async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!;
  // const nft = locklift.factory.getContractArtifacts("Nft");
  // const index = locklift.factory.getContractArtifacts("Index");
  // const indexBasis = locklift.factory.getContractArtifacts("IndexBasis");
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
    value: locklift.utils.toNano(1),
  });
  console.log(`Sample deployed at: ${sample.address.toString()}`);

  const keys = [];
  const sessions = [];
  for (let i = 0; i < 2; i++) {
    const n = getRandomNonce();
    sessions.push(n.toString());
    const h = sha256(n.toString());
    keys.push(`0x${h}`);
  }

  await sample.methods.addSessionKeys({
    hashes: keys
  }).sendExternal({
    publicKey: signer!.publicKey
  });

  console.log("added session keys", keys, sessions);

  await Promise.all([
    sample.methods.setStateBySessionKey({key: sessions[0], _state: 3}).sendExternal({withoutSignature: true, publicKey: "0"}),
    sample.methods.setStateBySessionKey({key: sessions[1], _state: 2}).sendExternal({withoutSignature: true, publicKey: "0"})
  ]);

  const { state } = await sample.methods.state({}).call();
  console.log('current state:', state);

}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
