import { DIDDocument } from 'did-resolver';
import { Authority, ConfigOptions } from './types';
import fetch, { FetchError } from 'node-fetch';
import { JsonRpc, Api } from 'eosjs';
import { SignatureProvider } from 'eosjs/dist/eosjs-api-interfaces';
import { TextEncoder, TextDecoder } from 'util';

// TODO: import the chain-registry from the resolver npm package.
const defaultChainRegistry: ConfigOptions = {
  'eos:testnet:jungle': {
    chainId: '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
    service: [
      {
        id: 'https://jungle3.cryptolions.io',
        type: 'LinkedDomains',
        serviceEndpoint: 'https://jungle3.cryptolions.io',
      },
    ],
  },
};

const ACCOUNT_NAME = `^([a-z1-5.]{0,12}[a-z1-5])$`;
const CHAIN_ID = new RegExp(`^([A-Fa-f0-9]{64})$`);
const CHAIN_NAME = new RegExp(
  `^(([a-z1-5.]{0,12}[a-z1-5])((:[a-z1-5.]{0,12}[a-z1-5])+)?)$`
);

export default async function create(
  chain: string,
  creator: string,
  name: string,
  owner: Authority,
  active: Authority,
  signatureProvider: SignatureProvider,
  options?: ConfigOptions
): Promise<DIDDocument> {
  // the user may want to override these values.
  const additionalOptions = {
    receiverAccount: 'eosio',
    authorization: [
      {
        actor: creator,
        permission: 'active',
      },
    ],
    buyrambytes: {
      bytes: 8192,
    },
    delegatebw: {
      stakeNetQuantity: '1.0000 EOS',
      stakeCpuQuantity: '1.0000 EOS',
      transfer: false,
    },
    configurationObject: {
      blocksBehind: 3,
      expireSeconds: 30,
    },
  };

  validateAccountName(creator);
  validateAccountName(name);

  const chainRegistry = {
    ...defaultChainRegistry,
    ...options,
  };

  const chainData = getChainData(chainRegistry, chain);

  let fetchAttempts = 0;
  for (const service of chainData.service) {
    fetchAttempts++;

    const rpc = new JsonRpc(service.serviceEndpoint, { fetch });
    const api = new Api({
      rpc: rpc,
      signatureProvider,
      textDecoder: new TextDecoder() as any,
      textEncoder: new TextEncoder(),
    });

    try {
      const result = await api.transact(
        {
          actions: [
            {
              account: additionalOptions.receiverAccount,
              name: 'newaccount',
              authorization: additionalOptions.authorization,
              data: {
                creator: creator,
                name: name,
                owner: owner,
                active: active,
              },
            },
            {
              account: additionalOptions.receiverAccount,
              name: 'buyrambytes',
              authorization: additionalOptions.authorization,
              data: {
                payer: creator,
                receiver: name,
                bytes: additionalOptions.buyrambytes.bytes,
              },
            },
            {
              account: additionalOptions.receiverAccount,
              name: 'delegatebw',
              authorization: additionalOptions.authorization,
              data: {
                from: creator,
                receiver: name,
                stake_net_quantity:
                  additionalOptions.delegatebw.stakeNetQuantity,
                stake_cpu_quantity:
                  additionalOptions.delegatebw.stakeNetQuantity,
                transfer: additionalOptions.delegatebw.transfer,
              },
            },
          ],
        },
        additionalOptions.configurationObject
      );
      console.dir(result);
      // TODO: convert transaction result to did document
      return { id: 'did:eosio:stub' };
    } catch (e) {
      if (
        !(e instanceof FetchError) ||
        fetchAttempts >= chainData.service.length
      )
        throw e;

      // else: continue with remaining service endpoints
    }
  }

  throw new Error('Could not create DID.');
}

function getChainData(chainRegistry: ConfigOptions, chainId: string) {
  // findChainByName
  const partsName = chainId.match(CHAIN_NAME);
  if (partsName) {
    const entry = chainRegistry[partsName[1]];
    if (entry) return entry;
    throw new Error(
      'No matching chain registry entry for supplied chain name.'
    );
  }

  // findChainById
  const partsID = chainId.match(CHAIN_ID);
  if (partsID) {
    for (let key of Object.keys(chainRegistry)) {
      const entry = chainRegistry[key];
      if (entry.chainId === partsID[1]) return entry;
      throw new Error(
        'No matching chain registry entry for supplied chain id.'
      );
    }
  }

  throw new Error(
    'Supplied chain id or name does not conform to specification.'
  );
}

function validateAccountName(name: string) {
  if (name.match(ACCOUNT_NAME) === null)
    throw new Error(name + ' does not conform to account name specification.');
}
