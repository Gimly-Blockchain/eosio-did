import { DIDDocument } from 'did-resolver';
import { create } from './create';
import { update } from './create';
import { deactivate } from './create';

type ConfigOptions = {
  [x: string]: {
    chainId: string,
    service: [{
      id: string,
      type: [string],
      serviceEndpoint: string
    }]
  }
}

type Authority = {
  threshold: number,
  keys?: [{
    key: string,
    weight: number
  }],
  accounts?: [{
    permission: {
      actor: string,
      permission: string
    },
    weight: number
  }],
  waits?: [{
    wait_sec: number,
    wait: number
  }]
}

export default class EosioDID {
  constructor(options: ConfigOptions) {

  }

  async create(creator: string, name: string, owner: Authority, active: Authority, options?: ConfigOptions): Promise<DIDDocument> {
    return { id: 'did:eosio:stub' };
  }

  async resolve(did: string, options?: ConfigOptions): Promise<DIDDocument> {
    return { id: 'did:eosio:stub' };
  }

  async update(account: string, permission: string, parent: string, auth: Authority, options?: ConfigOptions): Promise<DIDDocument> {
    return { id: 'did:eosio:stub' };
  }

  async deactivate(did: string, options?: ConfigOptions): Promise<void> {
    throw Error('EOSIO DID deactivate not supported');
  }
}