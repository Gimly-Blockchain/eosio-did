import { Resolver, DIDDocument } from 'did-resolver';
import {
  getResolver,
  eosioChainRegistry as defaultChainRegistry,
  REGEX_ACCOUNT_NAME,
  REGEX_CHAIN_ID,
  REGEX_CHAIN_NAME 
} from 'eosio-did-resolver';
import { Authority, ConfigOptions } from './types';
import fetch, { FetchError } from 'node-fetch';
import { JsonRpc, Api } from 'eosjs';
import { SignatureProvider } from 'eosjs/dist/eosjs-api-interfaces';
import { TextEncoder, TextDecoder } from 'util';

const resolver = new Resolver(getResolver());

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
    receiverAccount: options?.receiverAccount ? options.receiverAccount : 'eosio',
    authorization: [
      {
        actor: creator,
        permission: options?.creatorPermission ? options.creatorPermission : 'active',
      },
    ],
    buyrambytes: {
      bytes: options?.buyrambytes ? options.buyrambytes : 8192,
    },
    delegatebw: {
      stakeNetQuantity: options?.stakeNetQuantity ? options.stakeNetQuantity : '1.0000 EOS',
      stakeCpuQuantity: options?.stakeCpuQuantity ? options.stakeCpuQuantity : '1.0000 EOS',
      transfer: false,
    },
    config: {
      blocksBehind: 3,
      expireSeconds: 30,
    },
  };

  validateAccountName(creator);
  validateAccountName(name);

  const chainRegistry = {
    ...defaultChainRegistry,
    ...options?.registry,
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
        additionalOptions.config
      );

      console.dir(result);

      // fetch DIDDocument
      const did = `did:eosio:${chain}:${name}`;
      const didResult = await resolver.resolve(did, { fetch });

      const { error } = didResult.didResolutionMetadata;
      if (error) throw Error(error);
      if (didResult.didDocument === null) throw Error(`Could not fetch DIDDocument for DID ${did}`);
      else return didResult.didDocument;

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
  const partsName = chainId.match(REGEX_CHAIN_NAME);
  if (partsName) {
    const entry = chainRegistry[partsName[1]];
    if (entry) return entry;
    throw new Error(
      'No matching chain registry entry for supplied chain name.'
    );
  }

  // findChainById
  const partsID = chainId.match(REGEX_CHAIN_ID);
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
  if (name.match(REGEX_ACCOUNT_NAME) === null)
    throw new Error(name + ' does not conform to account name specification.');
}
