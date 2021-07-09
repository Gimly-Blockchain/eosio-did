import { CreateOptions, EosioOptions } from './types';

export const defaultEosioOptions: Partial<EosioOptions> = {
  accountPermission: 'active',
  transactionOptions: {
    blocksBehind: 3,
    expireSeconds: 30,
  },
};

export const defaultCreateOptions: Partial<CreateOptions> = {
  buyrambytes: 8192,
  stakeNetQuantity: '1.0000 EOS',
  stakeCpuQuantity: '1.0000 EOS',
  transfer: false,
};