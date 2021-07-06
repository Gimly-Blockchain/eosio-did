import { CreateOptions, EosioOptions, UpdateOptions } from './types';

export const defaultEosioOptions: EosioOptions = {
  transactionOptions: {
    blocksBehind: 3,
    expireSeconds: 30,
  },
};

export const defaultCreateOptions: CreateOptions = {
  receiverAccount: 'eosio',
  creatorPermission: 'active',
  buyrambytes: 8192,
  stakeNetQuantity: '1.0000 EOS',
  stakeCpuQuantity: '1.0000 EOS',
  transfer: false,
};

export const defaultUpdateOptions: UpdateOptions = {
  actionAccount: 'eosio',
  actionName: 'updateauth',
  parent: 'active',
};
