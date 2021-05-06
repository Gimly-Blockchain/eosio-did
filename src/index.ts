import create from './create';
import resolve from './resolve';
import update from './update';
import deactivate from './deactivate';
import { ConfigOptions, EosioDIDInterface } from './types';


export default class EosioDID implements EosioDIDInterface {
  constructor(options?: ConfigOptions) {

  }

  create = create;
  resolve = resolve;
  update = update;
  deactivate = deactivate;
}

export {
  create,
  resolve,
  update,
  deactivate
}