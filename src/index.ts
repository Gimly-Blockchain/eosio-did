import create from './create';
import update from './update';
import { Authority, CreateOptions, EosioOptions, UpdateOptions } from './types';
import { DIDDocument } from 'did-resolver';
import {
  defaultCreateOptions,
  defaultEosioOptions,
  defaultUpdateOptions,
} from './defaultEosioOptions';

export default class EosioDID {
  _options: EosioOptions;
  constructor(options: EosioOptions = {}) {
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
    });
  }
  async update(
    permission: string,
    auth: Authority,
    options?: UpdateOptions
  ): Promise<DIDDocument> {
    return update(permission, auth, {
      ...defaultUpdateOptions,
      ...this._options,
      ...options,
    });
  }
}

export { create, update };
