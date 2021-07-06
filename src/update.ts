import { DIDDocument, Resolver } from 'did-resolver';
import { getResolver } from 'eosio-did-resolver';
import { Api, JsonRpc } from 'eosjs';
import { Authority, UpdateOptions } from './types';
import fetch from 'node-fetch';
import eosioChainRegistry from '../node_modules/eosio-did-resolver/src/eosio-did-chain-registry.json';
import { checkBaseProperties, getChainData, validateAccountName } from './util';
import { TextDecoder, TextEncoder } from 'util';
import { SignatureProvider } from 'eosjs/dist/eosjs-api-interfaces';

const resolver = new Resolver(getResolver());

export default async function update(
  permission: string,
  auth: Authority,
  options: UpdateOptions
): Promise<DIDDocument> {
  checkBaseProperties(options);
  validateAccountName(options.account as string);
  const chainRegistry = {
    ...eosioChainRegistry,
    ...options.registry,
  };
  const chainData = getChainData(chainRegistry, options.chain as string);
  let success = false;
  for (const service of chainData.service) {
    const rpc = new JsonRpc(service.serviceEndpoint, { fetch });
    const api = new Api({
      rpc,
      signatureProvider: options.signatureProvider as SignatureProvider,
      textDecoder: new TextDecoder() as any,
      textEncoder: new TextEncoder(),
    });
    const updateauth_input = {
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
              account: options.actionAccount as string,
              name: options.actionName as string,
              authorization: [
                {
                  actor: options.account as string,
                  permission: options.parent as string,
                },
              ],
              data: updateauth_input,
            },
          ],
        },
        options.transactionOptions
      );
      success = true;
      break;
    } catch (err) {
      console.error(err);
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
