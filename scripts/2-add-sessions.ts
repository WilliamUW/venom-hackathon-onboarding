import { sha256 } from "js-sha256";
import { Address, getRandomNonce, toNano } from "locklift";

async function main() {
  const signer = await locklift.keystore.getSigner("0");
  const sample = locklift.factory.getDeployedContract(
    "Sample", new Address("0:7eb1407ad1c8835dfdb116bcdfbd797eb2bd34d564edc914297741b512275703"));

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

  console.log(keys, sessions);

  await Promise.all([
    sample.methods.setStateBySessionKey({key: sessions[0], _state: 3}).sendExternal({withoutSignature: true, publicKey: "0"}),
    sample.methods.setStateBySessionKey({key: sessions[0], _state: 2}).sendExternal({withoutSignature: true, publicKey: "0"})
  ]);
}
  

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
