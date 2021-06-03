import { ConfigOptions } from './types';

export default async function deactivate(
  did: string,
  options?: ConfigOptions
): Promise<void> {
  throw Error('EOSIO DID deactivate not supported');
}
