import { DIDResolutionResult, Resolver } from 'did-resolver';
import { getResolver } from 'eosio-did-resolver';
import { EosioOptions } from './types';

const resolver = new Resolver(getResolver());

export default async function resolve(
  did: string,
  options?: EosioOptions
): Promise<DIDResolutionResult> {
  return await resolver.resolve(did, { ...options });
}
