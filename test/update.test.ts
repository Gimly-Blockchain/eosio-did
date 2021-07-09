import EosioDID from '../src';
import { Authority } from '../src/types';
import { RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import jungleTestKeys from '../jungleTestKeys.json';

describe('EOSIO DID Update', () => {
  it('Update a DID', async () => {
    expect.assertions(2);
    const signatureProvider = new JsSignatureProvider([jungleTestKeys.private]);
    const myKey: Authority = {
      threshold: 1,
      accounts: [
        {
          permission: {
            actor: jungleTestKeys.name,
            permission: 'active',
          },
          weight: 1,
        },
      ],
      keys: [
        {
          key: 'EOS78wzfJjxDUaLe1KMnLvxKu7fsraHkMBBFoya1jhnxrxdMu6TLY',
          weight: 1,
        },
      ],
      waits: [],
    };
    let didDoc;
    try {
      const eosioDID = new EosioDID({
        account: jungleTestKeys.name,
        signatureProvider,
        chain: 'eos:testnet:jungle',
      });
      didDoc = await eosioDID.update('myperm', myKey);
    } catch (e) {
      console.log('\nCaught exception: ' + e);
      if (e instanceof RpcError) console.log(JSON.stringify(e.json, null, 2));
    }
    expect(didDoc).toBeDefined();
    const perm = (didDoc?.verificationMethod || []).filter(
      ({ id }) => id.split('#')[1] === 'myperm'
    )[0];
    expect(perm).toBeDefined();
  });
  it('Delete a Permission', async () => {
    expect.assertions(2);
    const signatureProvider = new JsSignatureProvider([jungleTestKeys.private]);
    let didDoc;
    try {
      const eosioDID = new EosioDID({
        account: jungleTestKeys.name,
        signatureProvider,
        chain: 'eos:testnet:jungle',
      });
      didDoc = await eosioDID.update('myperm', undefined);
    } catch (e) {
      console.log('\nCaught exception: ' + e);
      if (e instanceof RpcError) console.log(JSON.stringify(e.json, null, 2));
    }
    expect(didDoc).toBeDefined();
    const perm = (didDoc?.verificationMethod || []).filter(
      ({ id }) => id.split('#')[1] === 'myperm'
    )[0];
    expect(perm).not.toBeDefined();
  });
});
