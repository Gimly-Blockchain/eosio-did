import EosioDID from '../src/index';
import { Authority } from '../src/types';
import { RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

const jungleTestKeys = require('../jungleTestKeys.json');

const NEW_ACCOUNT_NAME = 'eosdidtest11';

describe('EOSIO DID class', async () => {
  it('Create a Jungle DID', async () => {
    const signatureProvider = new JsSignatureProvider([jungleTestKeys.private]);

    const eosioDid = new EosioDID();

    const myKey: Authority = {
      threshold: 1,
      keys: [
        {
          key: jungleTestKeys.public,
          weight: 1,
        },
      ],
      accounts: [],
      waits: [],
    };
    try {
      const didDoc = await eosioDid.create(
        'eos:testnet:jungle',
        jungleTestKeys.name,
        NEW_ACCOUNT_NAME,
        myKey,
        myKey,
        signatureProvider
      );
      console.log(didDoc);
    } catch (e) {
      console.log('\nCaught exception: ' + e);
      if (e instanceof RpcError) console.log(JSON.stringify(e.json, null, 2));
    }
  });
});
