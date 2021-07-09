import EosioDID from '../src/index';

const jungleTestKeys = require('../jungleTestKeys.json');

describe('EOSIO DID Resolve', () => {
  it('Resolve a Jungle DID', async () => {
    expect.assertions(1);
    const eosioDid = new EosioDID({
      chain: 'eos:testnet:jungle'
    });

    const did = `did:eosio:eos:testnet:jungle:${jungleTestKeys.name}`;
    const didDoc = await eosioDid.resolve(did);
    if (didDoc.didResolutionMetadata.error) {
      console.error(didDoc.didResolutionMetadata.error);
    }

    expect(didDoc.didDocument).toBeDefined();
  });
});