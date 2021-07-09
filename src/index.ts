import create from './create';
import update from './update';
import deactivate from './deactivate';
import {
  Authority,
  CreateOptions,
  EosioOptions,
  UpdateOptions,
  ChainRegistry,
  DIDUpdateResult,
  DIDCreateResult,
  DIDDeactivateResult,
} from './types';

import {
  defaultCreateOptions,
  defaultEosioOptions,
  defaultUpdateOptions,
} from './defaultEosioOptions';
import { SignatureProvider } from 'eosjs/dist/eosjs-api-interfaces';

export default class EosioDID {
  _options: EosioOptions;

  constructor(options: EosioOptions) {
    this._options = { ...defaultEosioOptions, ...options };
  }

  get options() {
    return this._options;
  }

  set options(options: EosioOptions) {
    this._options = options;
  }

  async create(
    name: string,
    owner: Authority,
    active: Authority,
    options?: CreateOptions
  ): Promise<DIDCreateResult> {
    return create(name, owner, active, {
      ...defaultCreateOptions,
      ...this._options,
      ...options,
    } as Required<CreateOptions>);
  }

  async update(
    permission: string,
    auth: Authority | undefined,
    options?: UpdateOptions
  ): Promise<DIDUpdateResult> {
    return update(permission, auth, {
      ...defaultUpdateOptions,
      ...this._options,
      ...options,
    } as Required<UpdateOptions>);
  }

  async deactivate(did: string, options?: EosioOptions): Promise<DIDDeactivateResult> {
    return deactivate(did, {
      ...this._options,
      ...options,
    } as Required<EosioOptions>)
  }
}

export {
  Authority,
  EosioOptions,
  CreateOptions,
  UpdateOptions,
  ChainRegistry,
  SignatureProvider,
};
