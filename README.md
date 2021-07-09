# Contributions

The EOSIO Identity Working Group is an open working group where we, the EOSIO community, discuss identity on EOSIO chains and progress work such as this DID specification and it's implementation. We have a weekly meeting and a Slack channel.

**[Join the EOSIO Identity Working Group](https://www.gimly.io/eosio-identity)**

Comments regarding this document are welcome. Please file issues and PRs directly on Github. Contributors are recognized through adding commits to the code base.

See [README.tsdx.md](./README.tsdx.md) for instructions on how to run, build, test and test this library.

Contributors:
- Jack Tanner <jack@gimly.io>
- Jonas Walter
- Julius Rahaus

# EOSIO DID

This library is intended to use EOSIO accounts as fully self managed [Decentralized Identifiers](https://w3c-ccg.github.io/did-spec/#decentralized-identifiers-dids) and wrap them in a [DID Document](https://w3c-ccg.github.io/did-spec/#did-documents)

It supports the proposed [Decentralized Identifiers](https://w3c-ccg.github.io/did-spec/) spec from the [W3C Credentials Community Group](https://w3c-ccg.github.io).

The DID specification can be found at [eosio-did-spec](https://github.com/Gimly-Blockchain/eosio-did-spec).

## DID Create

```js
const eosioDid = new EosioDID({
    chain: 'eos:testnet:jungle',
    account: 'didtester333',
    signatureProvider: new JsSignatureProvider(['PVT_K1_27yS4sdX86VDahQRABMLCcDABH5Vzy8vgLLS7wBeKESyrXetMf'])
});
const myPermission = {
    threshold: 1,
    keys: [{
        key: 'PUB_K1_5irHomACLB3oRbkqdgYTdh1GHGt8yvzQ7no5dxvEw5eYAiUiut',
        weight: 1,
    }],
    accounts: [],
    waits: [],
};

// "didtester333" account creates a new account called "newaccount11" with the owner and active permission set to "mypermission"
// on the Jungle testnet
const didCreateResult = await eosioDid.create('didtester333', 'newaccount11', myPermission, myPermission);
```

## DID Resolve

```js
const eosioDid = new EosioDID();

// resolves the "didtester333" account on the Jungle testnet account to a DID Document
const didResolveResult = await eosioDid.resolve('did:eosio:eos:testnet:jungle:didtester333');
```

## DID Update

```js
const eosioDID = new EosioDID({
    account: 'didtester333',
    signatureProvider: new JsSignatureProvider(['PVT_K1_27yS4sdX86VDahQRABMLCcDABH5Vzy8vgLLS7wBeKESyrXetMf']),
    chain: 'eos:testnet:jungle'
});

const myNewPermission = {
    threshold: 1,
    keys: [{
        key: 'PUB_K1_5irHomACLB3oRbkqdgYTdh1GHGt8yvzQ7no5dxvEw5eYAiUiut',
        weight: 1,
    }],
    accounts: [],
    waits: [],
};

// "didtester333" changes it's "active" permission to the "myNewPermission" on the Jungle testnet
const didUpdateResult = await eosioDID.update('didtester333', 'active', 'owner', myNewPermission);
```

## DID Deactivate

Note: DID Deactive always throws an error as it is not supported by default on an EOSIO chain. See the [EOSIO DID Spec](https://github.com/Gimly-Blockchain/eosio-did-spec#54-deactivate) for more information.
```js
const eosioDID = new EosioDID({
    account: 'didtester333',
    signatureProvider: new JsSignatureProvider(['PVT_K1_27yS4sdX86VDahQRABMLCcDABH5Vzy8vgLLS7wBeKESyrXetMf']),
    chain: 'eos:testnet:jungle'
});

// Will throw an error
await eosioDID.deactivate('did:eosio:eos:testnet:jungle:didtester333');
```

## Conficuration

All function calls (create, resolve, update, deactivate) can be called with an optional `options` argument with the following properties:
```ts
{
  chain?: string;
  fetch?: any,
  account?: string;
  signatureProvider?: SignatureProvider;
  accountPermission?: string;
  registry?: ChainRegistry;
  transactionOptions?: {
    blocksBehind?: number;
    expireSeconds?: number;
  };
}
```

### Create configuration

The create function can be called with the following _additional_ properties:
```ts
{
  receiverAccount?: sting;
  buyrambytes?: number;
  stakeNetQuantity?: string;
  stakeCpuQuantity?: string;
  transfer?: boolean;
}
```

### Create configuration

The update function can be called with the following _additional_ properties:
```ts
{
  actionAccount?: string;
  parent?: string;
}
```

## Error handling

All function calls (create, resolve, update, deactivate) return an object containing an errors encountered. They do not throw errors.

For example
```ts
const didResolveResult = await eosioDid.resolve('did:eosio:invalid_did_string');
// This will NOT throw an error

console.log(didResolveResult);
/*
{
    didResolutionMetadata: { 'invalidDid' },
    didDocument: null,
    didDocumentMetadata: {},
}
*/
```