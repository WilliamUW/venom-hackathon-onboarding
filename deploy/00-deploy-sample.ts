import { Address } from "locklift";
const wVenom = new Address("0:6bf25d251adabf1268a8870ad1b45d46fcf782ef9f1bfa7c16032484d3e54ac7");

export default async () => {
	const signer = (await locklift.keystore.getSigner('0'))!;
    await locklift.deployments.deploy(
        {
            deployConfig: {
                contract: "Sample",
                publicKey: signer!.publicKey,
                initParams: { nonce: locklift.utils.getRandomNonce(), owner: `0x${signer.publicKey}`,},
                constructorParams: { _state: 123, root_: wVenom },
                value: locklift.utils.toNano(2)
            },
            deploymentName: "Sample1",
            enableLogs: true
        });
    
};

export const tag = "sample1";