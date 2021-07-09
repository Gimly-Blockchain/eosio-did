import { DIDDocument } from 'did-resolver';
import { Authority, ConfigOptions } from './types';

export default async function update(
  account: string,
  permission: string,
  parent: string,
  auth: Authority,
  options?: ConfigOptions
): Promise<DIDDocument> {
  return { id: 'did:eosio:stub' };
}
