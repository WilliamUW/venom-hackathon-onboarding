import React, { useEffect, useState } from 'react';
import './App.css';

import { EverscaleStandaloneClient } from 'everscale-standalone-client';
import { VenomConnect } from 'venom-connect';
import { ProviderRpcClient, Address, Contract } from 'everscale-inpage-provider';

import { SAMPLE_ABI } from './abi/Sample';

const initVenomConnect = async () => {
  return new VenomConnect({
    theme: 'dark',
    checkNetworkId: 0,
    checkNetworkName: "Local Node",
    providersOptions: {
      venomwallet: {
        walletWaysToConnect: [
          {
            package: ProviderRpcClient,
            packageOptions: {
              fallback: VenomConnect.getPromise('venomwallet', 'extension') || (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
                fallback: () =>
                  EverscaleStandaloneClient.create({
                    connection: {
                      id: 1010,
                      group: 'venom_testnet',
                      type: 'jrpc',
                      data: {
                        endpoint: 'https://jrpc-devnet.venom.foundation/rpc',
                      },
                    },
                  }),
                forceUseFallback: true,
              },
            id: 'extension',
            type: 'extension',
          },
        ]
      },
    },
  });
};

const SAMPLE_ADDR = new Address("0:020ff6e84b1ceec087b81154e67c15f055cd64038e414b88b0ec017768dd27df");

function App() {
  const [VC, setVC] = useState<VenomConnect | undefined>();
  useEffect(() => {
    (async () => {
      const _vc = await initVenomConnect();
      setVC(_vc);
    })();
  }, []);

  useEffect(() => {
    // connect event handler
    const off = VC?.on('connect', onConnect);
    if (VC)
      (async () => await VC.checkAuth())();

    // just an empty callback, cuz we don't need it
    return () => {
      off?.();
    };
  }, [VC]);

  const login = async() => {
    if (!VC) return;
    await VC.connect();
  }

  const [addr, setAddr] = useState<string>();
  const [pubkey, setPubkey] = useState<string>();
  const [provider, setProvider] = useState<ProviderRpcClient | undefined>();
  const [isConnected, setIsConnected] = useState<boolean>();
  // This method allows us to gen a wallet address from inpage provider
  const getAddress = async (provider: any) => {
    const providerState = await provider?.getProviderState?.();
    return providerState?.permissions.accountInteraction?.address.toString();
  };
  const getPubkey = async (provider: any) => {
    const providerState = await provider?.getProviderState?.();
    return providerState?.permissions.accountInteraction?.publicKey;
  };

  // This handler will be called after venomConnect.login() action
  // connect method returns provider to interact with wallet, so we just store it in state
  const onConnect = async (provider: any) => {
    setProvider(provider);
    const venomWalletAddress = provider ? await getAddress(provider) : undefined;
    const publicKey = provider ? await getPubkey(provider) : undefined;
    setAddr(venomWalletAddress);
    setPubkey(publicKey);
    setIsConnected(true);
  };
  // This handler will be called after venomConnect.disconnect() action
  // By click logout. We need to reset address and balance.
  const onDisconnect = async () => {
    await provider?.disconnect();
    setAddr(undefined);
    setPubkey(undefined);
    setIsConnected(false);
  };

  const [sample, setSample] = useState<Contract<typeof SAMPLE_ABI> | undefined>();
  const [sampleState, setSampleState] = useState<string[]>();

  useEffect(() => {
    if ((!sample) || (!isConnected)) return;
    (async () => {
      const {state} = await sample.methods.state({}).call();
      setSampleState(state);
    })();

    const contractEvents = sample.events(new provider!.Subscriber());
    contractEvents.on(event => {
      if (event.event != "StateChange") return;
      sampleState?.push(event.data._state);
      setSampleState(sampleState);
    })
  }, [sample]);

  useEffect(() => {
    if (!provider) return;
    const contr = new provider.Contract(SAMPLE_ABI, SAMPLE_ADDR);
    setSample(contr);
  }, [provider]);

  const sendExternalMsg = async () => {
    await Promise.all([
      sample?.methods.setStateBySessionKey({key: "33360", _state: 44}).sendExternal({
        withoutSignature: true,
        publicKey: "0",
      }),
      sample?.methods.setStateBySessionKey({key: "1503", _state: 45}).sendExternal({
        withoutSignature: true,
        publicKey: "0",
      }),
    ]);
  }

  return (
    <div className="App">
      <header className="App-header">
        {addr ? <>
          Sample state: {sampleState} <br />
          <button onClick={sendExternalMsg}>Change state</button>
          <button onClick={onDisconnect}>Disconnect</button>
          </>
          :
          <button onClick={login}>Connect Wallet</button>
        }
      </header>
    </div>
  );
}

export default App;
