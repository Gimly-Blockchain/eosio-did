import { DIDDeactivateResult, EosioOptions } from './types';

export default async function deactivate(
  did: string,
  options?: EosioOptions
): Promise<DIDDeactivateResult> {
  throw Error('EOSIO DID deactivate not supported. If this EOSIO chain support deactivation of accounts, please override this function with the appropriate functionality');
}
