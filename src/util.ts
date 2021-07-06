/* import {
  REGEX_ACCOUNT_NAME,
  REGEX_CHAIN_ID,
  REGEX_CHAIN_NAME,
} from 'eosio-did-resolver'; */
import { ChainData, ChainRegistry } from './types';

export function getChainData(
  chainRegistry: ChainRegistry,
  chainId: string
): ChainData {
  // findChainByName
  const partsName = chainId.match(
    /(([a-z1-5.]{0,12}[a-z1-5])((:[a-z1-5.]{0,12}[a-z1-5])+)?)/
  );
  if (partsName) {
    const entry = chainRegistry[partsName[1]];
    if (entry) return entry;
    throw new Error(
      'No matching chain registry entry for supplied chain name.'
    );
  }

  // findChainById
  const partsID = chainId.match(
    /(([a-z1-5.]{0,12}[a-z1-5])((:[a-z1-5.]{0,12}[a-z1-5])+)?)/
  );
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

export function validateAccountName(name: string): void {
  return;
  /* if (name.match(REGEX_ACCOUNT_NAME) === null)
    throw new Error(name + ' does not conform to account name specification.'); */
}

export function checkBaseProperties(options: any): void {
  ['chain', 'account', 'signatureProvider'].forEach(key => {
    if (!(key in options)) throw Error(`Missing property ${key}`);
  });
}
