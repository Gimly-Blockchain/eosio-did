import EosioDID from '../src';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import jungleTestKeys from '../jungleTestKeys.json';

describe('EOSIO DID Deactivate', () => {
  it('Try deactivate a DID', async () => {
    expect.assertions(1);
    const signatureProvider = new JsSignatureProvider([jungleTestKeys.private]);
    const eosioDID = new EosioDID({
      account: jungleTestKeys.name,
      signatureProvider,
      chain: 'eos:testnet:jungle',
    });

    const did = `did:eosio:eos:testnet:jungle:${jungleTestKeys.name}`;
    try {
      await eosioDID.deactivate(did);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

});
