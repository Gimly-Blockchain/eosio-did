import create from './create';
import update from './update';
import {
  Authority,
  CreateOptions,
  EosioOptions,
  UpdateOptions,
  ChainRegistry,
} from './types';
import { DIDDocument } from 'did-resolver';
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
  ): Promise<DIDDocument> {
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
  ): Promise<DIDDocument> {
    return update(permission, auth, {
      ...defaultUpdateOptions,
      ...this._options,
      ...options,
    } as Required<UpdateOptions>);
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
