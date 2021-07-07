import { Resolver, DIDDocument } from 'did-resolver';
import { getResolver, eosioChainRegistry } from 'eosio-did-resolver';
import { Authority, CreateOptions } from './types';
import fetch, { FetchError } from 'node-fetch';
import { JsonRpc, Api } from 'eosjs';
import { TextEncoder, TextDecoder } from 'util';
import { checkBaseProperties, getChainData, validateAccountName } from './util';
import { SignatureProvider } from 'eosjs/dist/eosjs-api-interfaces';

const resolver = new Resolver(getResolver());

export default async function create(
  name: string,
  owner: Authority,
  active: Authority,
  options: CreateOptions
): Promise<DIDDocument> {
  checkBaseProperties(options);
  validateAccountName(options.account as string);
  validateAccountName(name);
  const chainRegistry = {
    ...eosioChainRegistry,
    ...options.registry,
  };
  const chainData = getChainData(chainRegistry, options.chain as string);
  let fetchAttempts = 0;
  for (const service of chainData.service) {
    fetchAttempts++;
    const rpc = new JsonRpc(service.serviceEndpoint, { fetch });
    const api = new Api({
      rpc: rpc,
      signatureProvider: options.signatureProvider as SignatureProvider,
      textDecoder: new TextDecoder() as any,
      textEncoder: new TextEncoder(),
    });
    try {
      const authorization = [
        {
          actor: options.account as string,
          permission: options.creatorPermission as string,
        },
      ];
      const result = await api.transact(
        {
          actions: [
            {
              account: options.receiverAccount,
              name: 'newaccount',
              authorization,
              data: {
                creator: options.account,
                name: name,
                owner: owner,
                active: active,
              },
            },
            {
              account: options.receiverAccount,
              name: 'buyrambytes',
              authorization,
              data: {
                payer: options.account,
                receiver: name,
                bytes: options.buyrambytes,
              },
            },
            {
              account: options.receiverAccount,
              name: 'delegatebw',
              authorization,
              data: {
                from: options.account,
                receiver: name,
                stake_net_quantity: options.stakeNetQuantity,
                stake_cpu_quantity: options.stakeNetQuantity,
                transfer: options.transfer,
              },
            },
          ],
        },
        options.transactionOptions
      );
      console.dir(result);
      // fetch DIDDocument
      const did = `did:eosio:${options.chain}:${name}`;
      const didResult = await resolver.resolve(did, { fetch });
      const { error } = didResult.didResolutionMetadata;
      if (error) throw Error(error);
      if (didResult.didDocument === null)
        throw Error(`Could not fetch DIDDocument for DID ${did}`);
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
