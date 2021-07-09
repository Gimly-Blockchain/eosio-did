import create from './create';
import resolve from './resolve';
import update from './update';
import deactivate from './deactivate';
import { ConfigOptions, EosioDIDInterface, Authority } from './types';
import { SignatureProvider } from 'eosjs/dist/eosjs-api-interfaces';
import { DIDDocument } from 'did-resolver';

export default class EosioDID implements EosioDIDInterface {
  options: ConfigOptions;
  constructor(options: ConfigOptions = {}) {
    this.options = options;
  }

  async create(
    chain: string,
    creator: string,
    name: string,
    owner: Authority,
    active: Authority,
    signatureProvider: SignatureProvider,
    options?: ConfigOptions
  ): Promise<DIDDocument> {
    return await create(
      chain,
      creator,
      name,
      owner,
      active,
      signatureProvider,
      { ...this.options, ...options }
    );
  }
  resolve = resolve;
  update = update;
  deactivate = deactivate;
}

export { create, resolve, update, deactivate };
