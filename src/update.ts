import { getResolver, eosioChainRegistry } from 'eosio-did-resolver';
import { Api, JsonRpc, RpcError } from 'eosjs';
import { Authority, DIDUpdateResult, UpdateOptions } from './types';
import { getChainData, validateAccountName } from './util';
import { TextDecoder, TextEncoder } from 'util';
import { Resolver } from 'did-resolver';

const resolver = new Resolver(getResolver());

export default async function update(
  permission: string,
  auth: Authority | undefined,
  options: Required<UpdateOptions>
): Promise<DIDUpdateResult> {
  validateAccountName(options.account);

  const chainRegistry = {
    ...eosioChainRegistry,
    ...options.registry,
  };
  const chainData = getChainData(chainRegistry, options.chain);

  for (const service of chainData.service) {
    const rpc = new JsonRpc(service.serviceEndpoint, options.fetch ? { fetch: options.fetch } : undefined);
    const api = new Api({
      rpc,
      signatureProvider: options.signatureProvider,
      textDecoder: new TextDecoder() as any,
      textEncoder: new TextEncoder(),
    });
    const data =
      auth === undefined
        ? {
          account: options.account,
          permission,
        }
        : {
          account: options.account,
          permission,
          parent: options.parent,
          auth,
        };
    try {
      const result: any = await api.transact(
        {
          actions: [
            {
              account: options.actionAccount,
              name: auth === undefined ? 'deleteauth' : 'updateauth',
              authorization: [
                {
                  actor: options.account,
                  permission: options.accountPermission,
                },
              ],
              data,
            },
          ],
        },
        options.transactionOptions
      );

      // fetch DIDDocument
      const did = `did:eosio:${options.chain}:${options.account}`;
      const didResult = await resolver.resolve(did, { ...options });
      const { error } = didResult.didResolutionMetadata;
      if (error) {
        return {
          didUpdateMetadata: {
            tx: result,
            error: error
          }
        };
      }
      if (!didResult.didDocument) {
        return {
          didUpdateMetadata: {
            error: 'notFound'
          }
        };
      }

      return {
        didUpdateMetadata: {
          tx: result
        },
        didDocument: didResult.didDocument
      }
    } catch (err) {
      if (err instanceof RpcError) {
        return {
          didUpdateMetadata: {
            error: err
          }
        }
      }
      console.error(err);
    }
  }

  throw new Error('Could not update DID.');
}
