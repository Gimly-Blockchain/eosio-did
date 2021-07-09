import { Resolver } from 'did-resolver';
import { getResolver, eosioChainRegistry } from 'eosio-did-resolver';
import { Authority, CreateOptions, DIDCreateResult } from './types';
import { JsonRpc, Api, RpcError } from 'eosjs';
import { TextEncoder, TextDecoder } from 'util';
import { getChainData, validateAccountName } from './util';

const resolver = new Resolver(getResolver());

export default async function create(
  creator: string,
  name: string,
  owner: Authority,
  active: Authority,
  options: Required<CreateOptions>
): Promise<DIDCreateResult> {
  validateAccountName(creator);
  validateAccountName(name);

  const chainRegistry = {
    ...eosioChainRegistry,
    ...options.registry,
  };
  const chainData = getChainData(chainRegistry, options.chain);
  const authorization = [
    {
      actor: creator,
      permission: options.accountPermission,
    },
  ];

  for (const service of chainData.service) {
    const rpc = new JsonRpc(service.serviceEndpoint, options.fetch ? { fetch: options.fetch } : undefined);
    const api = new Api({
      rpc: rpc,
      signatureProvider: options.signatureProvider,
      textDecoder: new TextDecoder() as any,
      textEncoder: new TextEncoder(),
    });
    try {
      const result: any = await api.transact(
        {
          actions: [
            {
              account: 'eosio',
              name: 'newaccount',
              authorization,
              data: {
                creator: creator,
                name: name,
                owner: owner,
                active: active,
              },
            },
            {
              account: 'eosio',
              name: 'buyrambytes',
              authorization,
              data: {
                payer: creator,
                receiver: name,
                bytes: options.buyrambytes,
              },
            },
            {
              account: 'eosio',
              name: 'delegatebw',
              authorization,
              data: {
                from: creator,
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

      // fetch DIDDocument
      const did = `did:eosio:${options.chain}:${name}`;
      const didResult = await resolver.resolve(did, { ...options });
      const { error } = didResult.didResolutionMetadata;
      if (error) {
        return {
          didCreateMetadata: {
            tx: result,
            error: error
          }
        };
      }
      if (!didResult.didDocument) {
        return {
          didCreateMetadata: {
            error: 'notFound'
          }
        };
      }

      return {
        didCreateMetadata: {
          tx: result
        },
        didDocument: didResult.didDocument
      }
    } catch (e) {
      if (e instanceof RpcError) {
        return {
          didCreateMetadata: {
            error: e
          }
        }
      }
      console.error(e);
    }
  }

  throw new Error('Could not create DID.');
}
