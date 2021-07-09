import create from './create';
import update from './update';
import deactivate from './deactivate';
import resolve from './resolve';
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
import { DIDResolutionResult } from 'did-resolver';

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
    creator: string,
    name: string,
    owner: Authority,
    active: Authority,
    options?: CreateOptions
  ): Promise<DIDCreateResult> {
    return await create(creator, name, owner, active, {
      ...defaultCreateOptions,
      ...this._options,
      ...options,
    } as Required<CreateOptions>);
  }

  async resolve(
    did: string,
    options?: EosioOptions
  ): Promise<DIDResolutionResult> {
    return await resolve(did, {
      ...this._options,
      ...options,
    } as Required<EosioOptions>);
  }

  async update(
    account: string,
    permission: string,
    parent: string,
    auth: Authority,
    options?: EosioOptions
  ): Promise<DIDUpdateResult> {
    return await update(account, permission, parent, auth, {
      ...defaultUpdateOptions,
      ...this._options,
      ...options,
    } as Required<UpdateOptions>);
  }

  async deactivate(did: string, options?: EosioOptions): Promise<DIDDeactivateResult> {
    return await deactivate(did, {
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
