import { DIDDocument } from 'did-resolver';
import { SignatureProvider } from 'eosjs/dist/eosjs-api-interfaces';

export interface ChainData {
  chainId: string;
  service: {
    id: string;
    type: string | [string];
    serviceEndpoint: string;
  }[];
}

export interface ChainRegistry {
  [x: string]: ChainData;
}

export interface EosioOptions {
  registry?: ChainRegistry;
  chain?: string;
  account?: string;
  transactionOptions?: {
    blocksBehind?: number;
    expireSeconds?: number;
  };
  signatureProvider?: SignatureProvider;
}

export interface CreateOptions extends EosioOptions {
  receiverAccount?: sting;
  creatorPermission?: string;
  buyrambytes?: number;
  stakeNetQuantity?: string;
  stakeCpuQuantity?: string;
  transfer: boolean;
}

export interface UpdateOptions extends EosioOptions {
  actionName?: 'updateauth' | 'deleteauth';
  actionAccount?: string;
  parent?: string;
}

export interface Authority {
  threshold: number;
  keys?: [
    {
      key: string;
      weight: number;
    }
  ];
  accounts:
    | []
    | [
        {
          permission: {
            actor: string;
            permission: string;
          };
          weight: number;
        }
      ];
  waits:
    | []
    | [
        {
          wait_sec: number;
          wait: number;
        }
      ];
}
