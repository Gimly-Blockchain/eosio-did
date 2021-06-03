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

/*
    Just a reminder of how a transaction result looks like.
{
    transaction_id: '192ad904a433b69ed35a9ea6a9c3880e8b16629aee26a846024cb0f81389ca1e',
    processed: {
      id: '192ad904a433b69ed35a9ea6a9c3880e8b16629aee26a846024cb0f81389ca1e',
      block_num: 81109622,
      block_time: '2021-06-03T16:59:06.500',
      producer_block_id: null,
      receipt: { status: 'executed', cpu_usage_us: 430, net_usage_words: 42 },
      elapsed: 430,
      net_usage: 336,
      scheduled: false,
      action_traces: [ [Object], [Object], [Object] ],
      account_ram_delta: null,
      except: null,
      error_code: null
    }
}
 */
