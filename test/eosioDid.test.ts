import EosioDID from '../src/index';
import { Authority } from '../src/types';

describe('EOSIO DID class', async () => {

    it('Create a Jungle DID', async () => {

        const eosioDid = new EosioDID();

        const myKey: Authority = {
            threshold: 1,
            keys: [{
                key: '',
                weight: 1
            }]
        }
        const didDoc = await eosioDid.create('b1', 'example', myKey, myKey);
        console.log(didDoc);
    })

});
