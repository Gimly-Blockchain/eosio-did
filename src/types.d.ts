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
  chain: string;
  account: string;
  signatureProvider: SignatureProvider;
  accountPermission?: string;
  registry?: ChainRegistry;
  transactionOptions?: {
    blocksBehind?: number;
    expireSeconds?: number;
  };
}

export interface CreateOptions extends Partial<EosioOptions> {
  receiverAccount?: sting;
  buyrambytes?: number;
  stakeNetQuantity?: string;
  stakeCpuQuantity?: string;
  transfer?: boolean;
}

export interface UpdateOptions extends Partial<EosioOptions> {
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
