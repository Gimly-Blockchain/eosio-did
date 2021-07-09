import { DIDDocument, Resolver } from 'did-resolver';
import { getResolver, eosioChainRegistry } from 'eosio-did-resolver';
import { Api, JsonRpc } from 'eosjs';
import { Authority, UpdateOptions } from './types';
import fetch, { FetchError } from 'node-fetch';
import { getChainData, validateAccountName } from './util';
import { TextDecoder, TextEncoder } from 'util';

const resolver = new Resolver(getResolver());

export default async function update(
  permission: string,
  auth: Authority | undefined,
  options: Required<UpdateOptions>
): Promise<DIDDocument> {
  validateAccountName(options.account);
  const chainRegistry = {
    ...eosioChainRegistry,
    ...options.registry,
  };
  const chainData = getChainData(chainRegistry, options.chain);
  let success = false;
  for (const service of chainData.service) {
    const rpc = new JsonRpc(service.serviceEndpoint, { fetch });
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
      await api.transact(
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
      success = true;
      break;
    } catch (err) {
      if (!(err instanceof FetchError)) throw err;
    }
  }
  if (!success) throw new Error('Could not update DID.');
  const {
    didDocument,
    didResolutionMetadata: { error },
  } = await resolver.resolve(`did:eosio:${options.chain}:${options.account}`, {
    fetch,
  });
  if (didDocument === null) throw Error(error);
  return didDocument;
}
