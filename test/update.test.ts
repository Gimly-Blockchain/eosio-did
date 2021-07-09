import EosioDID from '../src';
import { Authority } from '../src/types';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import jungleTestKeys from '../jungleTestKeys.json';
import fetch from 'node-fetch';

describe('EOSIO DID Update', () => {
  it('Update a DID', async () => {
    expect.assertions(3);
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
    const eosioDID = new EosioDID({
      signatureProvider,
      chain: 'eos:testnet:jungle',
      fetch
    });

    const didDoc = await eosioDID.update(jungleTestKeys.name, 'active2', 'owner', myKey);
    if (didDoc.didUpdateMetadata.error) {
      console.error(didDoc.didUpdateMetadata.error);
    }

    expect(didDoc.didUpdateMetadata.tx).toBeDefined();
    expect(didDoc.didDocument).toBeDefined();
    const perm = (didDoc?.didDocument?.verificationMethod || []).filter(
      ({ id }) => id.split('#')[1] === 'active2'
    )[0];
    expect(perm).toBeDefined();
  });
});
